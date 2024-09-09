using backend.Extensions;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using backend.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/user-information")]
    [ApiController]
    public class UserInformationController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserInformationRepository _userInformationRepo;
        public UserInformationController(UserManager<AppUser> userManager, IUserInformationRepository userInformationRepo)
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
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userInfo = await _userInformationRepo.GetByIdAsync(id);
            if (userInfo == null)
            {
                return NotFound();
            }
            return Ok(userInfo.ToUserInformationDto());
        }
    }
}