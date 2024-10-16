using backend.Dtos.Account;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Controllers.Admin
{
    [Route("api/admin/account")]
    [ApiController]
    public class AccountAdminController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly IProductRepository _productRepo;
        private readonly IOrdersRepository _ordersRepo;
        private readonly IOrdersDetailsRepository _ordersDetailsRepo;
        public AccountAdminController(UserManager<AppUser> userManager, ITokenService tokenService,
        SignInManager<AppUser> signInManager, IEmailSender emailSender)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _emailSender = emailSender;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());
            if (user == null)
            {
                return Unauthorized("Invalid Username!");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded) return Unauthorized("Username or password incorrect!");

            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains("Admin"))
            {
                return Unauthorized("Access restricted to Admin only.");
            }
            var token = await _tokenService.CreateToken(user);
            Response.Cookies.Append("Token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = DateTime.Now.AddHours(1),
                SameSite = SameSiteMode.None
            });
            return Ok(
                new NewUserDto
                {
                    Username = user.UserName,
                    Email = user.Email,
                    Token = token,
                    Roles = roles
                }
            );
        }
        [HttpGet]
        // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userManager.Users.ToListAsync();

            var userList = new List<AccountDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                var filteredRoles = roles.Where(role => role == "Creator" || role == "User").ToList();

                userList.Add(new AccountDto
                {
                    Id = user.Id,
                    Username = user.UserName,
                    Email = user.Email,
                    Roles = roles
                });
            }

            return Ok(userList);
        }
        [HttpDelete("deleteuser/{identifier}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete([FromRoute] string identifier)
        {
            try
            {
                AppUser user = await _userManager.FindByIdAsync(identifier);

                if (user == null)
                {
                    user = await _userManager.FindByNameAsync(identifier);
                    if (user == null)
                    {
                        return NotFound("User not found.");
                    }
                }
                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    return StatusCode(500, "Error deleting user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                }

                return Ok(new { message = "User deleted successfully." });
            }
            catch (Exception e)
            {
                return StatusCode(500, $"An error occurred: {e.Message}");
            }
        }
    }
}