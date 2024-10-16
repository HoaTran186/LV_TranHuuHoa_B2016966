using backend.Dtos.Forum;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Account
{
    [Route("api/account/forum")]
    [ApiController]
    public class ForumController : ControllerBase
    {
        private readonly IForumRepository _forumRepo;
        private readonly UserManager<AppUser> _userManager;
        private readonly IForumImagesRepository _forumImagesRepo;
        private readonly IForumCommentRepository _forumCommentRepo;
        public ForumController(IForumRepository forumRepo, UserManager<AppUser> userManager, IForumImagesRepository forumImagesRepo, IForumCommentRepository forumCommentRepo)
        {
            _forumCommentRepo = forumCommentRepo;
            _forumImagesRepo = forumImagesRepo;
            _forumRepo = forumRepo;
            _userManager = userManager;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllForum([FromQuery] QueryForum queryForum)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var forum = await _forumRepo.GetAllAsync(queryForum);
            var forumDto = forum.Select(s => s.ToForumDto());
            return Ok(forumDto);
        }
        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetByIdForum([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var forum = await _forumRepo.GetByIdAsync(id);
            if (forum == null)
            {
                return NotFound();
            }
            return Ok(forum.ToForumDto());
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateForum([FromBody] CreateForumDto createForumDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var forumModel = createForumDto.ToForumFromCreateDto(appUser.Id);
            await _forumRepo.CreateAsync(forumModel);
            return Ok(forumModel);
        }
        [HttpPut]
        [Route("{id:int}")]
        [Authorize]
        public async Task<IActionResult> UpdateForum([FromRoute] int id, [FromBody] UpdateForumDto updateForumDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var existingForum = await _forumRepo.GetByIdAsync(id);
            if (existingForum == null)
            {
                return NotFound();
            }
            if (existingForum.UserId != appUser.Id)
            {
                return BadRequest("You do not have permission to update this forum.");
            }
            var forumModel = await _forumRepo.UpdateAsync(id, updateForumDto.ToForumFromUpdateDto());
            if (forumModel == null)
            {
                return NotFound();
            }
            return Ok(forumModel.ToForumDto());
        }
        [HttpGet("my-forum")]
        [Authorize]
        public async Task<IActionResult> GetAllForums([FromQuery] QueryForum queryForum)
        {
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var userForum = await _forumRepo.GetUserForum(appUser, queryForum);
            var userForumDto = userForum.Select(s => s.ToForumDto());
            return Ok(userForumDto);
        }
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var existingForum = await _forumRepo.GetByIdAsync(id);
            if (existingForum == null)
            {
                return NotFound();
            }

            if (existingForum.UserId != appUser.Id)
            {
                return BadRequest("You do not have permission to delete this forum.");
            }
            var comments = await _forumCommentRepo.GetByForumId(id);
            if (comments != null)
            {
                foreach (var comment in comments)
                {
                    await _forumCommentRepo.DeleteAsync(comment.Id);
                }
            }
            var images = await _forumImagesRepo.GetByForumId(id);
            if (images != null)
            {
                foreach (var image in images)
                {
                    // Xóa hình ảnh khỏi thư mục hoặc cơ sở dữ liệu
                    _forumImagesRepo.DeleteAsync(image.Id);
                }
            }
            var forumModel = await _forumRepo.DeleteAsync(id);
            if (forumModel == null)
            {
                return NotFound();
            }
            return Ok("Deleted");
        }
        [HttpPut]
        [Route("browse/{id:int}")]
        public async Task<IActionResult> UpdateBrowse([FromRoute] int id, [FromBody] UpdateBrowseDto updateBrowseDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var forumBrowse = await _forumRepo.UpdateBrowse(id, updateBrowseDto.ToForumFromUpdateBrowseDto());
            if (forumBrowse == null)
            {
                return NotFound();
            }
            return Ok(forumBrowse.ToForumDto());
        }
    }
}