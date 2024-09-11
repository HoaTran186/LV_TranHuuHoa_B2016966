using backend.Dtos.UserInformation;
using backend.Extensions;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using backend.Repository;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize]
        public async Task<IActionResult> GetUser()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            if (appUser == null)
            {
                return NotFound("User not found.");
            }

            var userInfo = await _userInformationRepo.GetByUserIdAsync(appUser.Id);
            if (userInfo == null)
            {
                return NotFound("User information not found.");
            }

            var userInfoDto = userInfo.ToUserInformationDto();

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
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateUserInformationDto createUserInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);

            var existingUserInfo = await _userInformationRepo.GetByUserIdAsync(appUser.Id);
            if (existingUserInfo != null)
            {
                return BadRequest("User information already exists.");
            }

            var userInfoModel = createUserInfo.ToUserInformationFromCreateDto(appUser.Id);
            await _userInformationRepo.CreateAsync(userInfoModel);

            return Ok(userInfoModel);
        }
        [HttpPut]
        [Route("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateUserInformationDto updateUserInfor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var existingUserInfo = await _userInformationRepo.GetByUserIdAsync(appUser.Id);
            if (existingUserInfo == null)
            {
                return NotFound();
            }
            var userInfoModel = await _userInformationRepo.UpddateAsync(id, updateUserInfor.ToUserInformationFromUpdateDto(appUser.Id));
            if (userInfoModel == null)
            {
                return NotFound();
            }
            return Ok(userInfoModel.ToUserInformationDto());

        }
        [HttpDelete]
        [Route("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var existingUserInfo = await _userInformationRepo.GetByUserIdAsync(appUser.Id);
            if (existingUserInfo == null)
            {
                return NotFound();
            }
            var userInfoModel = await _userInformationRepo.DeleteAsync(id);
            if (userInfoModel == null)
            {
                return NotFound();
            }
            return Ok("Deleted user imformation");
        }
    }
}