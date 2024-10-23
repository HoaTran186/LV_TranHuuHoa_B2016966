
using backend.Container;
using backend.Dtos.Account;
using backend.Extensions;
using backend.Interfaces;
using backend.Models;


using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;


namespace backend.Controllers.Account
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _config;
        public AccountController(IMemoryCache cache, UserManager<AppUser> userManager, ITokenService tokenService,
        SignInManager<AppUser> signInManager, IEmailSender emailSender, IConfiguration config)
        {
            _cache = cache;
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _config = config;
        }
        [HttpGet]
        public async Task<IActionResult> GetUser()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var username = User.GetUserName();

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null)
            {
                return NotFound("User not found");
            }

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {

                Username = user.UserName,
                Email = user.Email,
                Roles = roles
            });
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
            if (!roles.Contains("User") && !roles.Contains("Creator"))
            {
                return Unauthorized("Access restricted to Users and Creators only.");
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

        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOtp(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }
            var newOtp = new Random().Next(100000, 999999).ToString();
            var emailRs = new EmailOTP();
            var cacheKey = $"OTP_{email}";
            _cache.Set(cacheKey, newOtp, TimeSpan.FromMinutes(5));
            var emailSubject = "Your OTP for Registration";
            var emailBody = emailRs.GenerateOtpEmailBody(newOtp);
            await _emailSender.SendEmailAsync(email, emailSubject, emailBody);

            return Ok("A new OTP has been sent to your email.");
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
                if (user == null)
                {
                    return BadRequest("User not found.");
                }

                var otp = new Random().Next(100000, 999999).ToString();
                var cacheKey = $"OTP_{forgotPasswordDto.Email}";
                _cache.Set(cacheKey, otp, TimeSpan.FromMinutes(5));

                var emailSubject = "Your OTP for Password Reset";
                var emailBody = new EmailOTP().GenerateOtpEmailBody(otp);
                await _emailSender.SendEmailAsync(forgotPasswordDto.Email, emailSubject, emailBody);

                return Ok("OTP for password reset has been sent to your email.");
            }
            catch (Exception e)
            {
                return StatusCode(500, $"An error occurred: {e.Message}");
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var cacheKey = $"OTP_{resetPasswordDto.Email}";
                if (_cache.TryGetValue(cacheKey, out string otpInCache))
                {
                    if (otpInCache == resetPasswordDto.Otp)
                    {
                        var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
                        if (user == null)
                        {
                            return BadRequest("User not found.");
                        }

                        var resetPasswordResult = await _userManager.RemovePasswordAsync(user);
                        if (!resetPasswordResult.Succeeded)
                        {
                            return StatusCode(500, resetPasswordResult.Errors);
                        }

                        var addPasswordResult = await _userManager.AddPasswordAsync(user, resetPasswordDto.NewPassword);
                        if (!addPasswordResult.Succeeded)
                        {
                            return StatusCode(500, addPasswordResult.Errors);
                        }

                        return Ok("Password has been reset successfully.");
                    }
                    else
                    {
                        return BadRequest("Invalid OTP.");
                    }
                }
                else
                {
                    return BadRequest("OTP expired or not found.");
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, $"An error occurred: {e.Message}");
            }
        }
    }
}