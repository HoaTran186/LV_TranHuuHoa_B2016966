using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Admin
{
    [Route("api/users-information")]
    [ApiController]
    public class UsersInformationController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserInformationRepository _userInformationRepo;
        public UsersInformationController(UserManager<AppUser> userManager, IUserInformationRepository userInformationRepo)
        {
            _userManager = userManager;
            _userInformationRepo = userInformationRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userInfo = await _userInformationRepo.GetAllAsync();
            var userInfoDto = userInfo.Select(s => s.ToUserInformationDto());

            return Ok(userInfoDto);

        }
    }
}