

using backend.Dtos.Forum.ForumComment;
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
    [Route("api/account/forum-comment")]
    [ApiController]
    public class ForumCommentController : ControllerBase
    {
        private readonly IForumRepository _forumRepo;
        private readonly IForumCommentRepository _forumCommentRepo;
        private readonly UserManager<AppUser> _userManager;
        public ForumCommentController(IForumRepository forumRepo, IForumCommentRepository forumCommentRepo, UserManager<AppUser> userManager)
        {
            _forumCommentRepo = forumCommentRepo;
            _forumRepo = forumRepo;
            _userManager = userManager;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] QueryCommentForum queryComment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var comments = await _forumCommentRepo.GetAllAsync(queryComment);
            return Ok(comments);
        }
        [HttpGet("{forumId:int}")]
        public async Task<IActionResult> GetById([FromRoute] int forumId, [FromQuery] QueryCommentForum queryComment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var comments = await _forumCommentRepo.GetByForumIdAsync(forumId, queryComment);
            if (comments == null)
            {
                return NotFound();
            }
            return Ok(comments);
        }
        [HttpPost("{forumId:int}")]
        [Authorize]
        public async Task<IActionResult> Create([FromRoute] int forumId, [FromBody] CreateCommentForumDto commentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _forumRepo.ForumExists(forumId))
            {
                return BadRequest("Forum does not exist");
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var forum = await _forumRepo.GetByIdAsync(forumId);
            if (forum.Rating == 0)
            {
                forum.Rating = commentDto.Star;
            }
            else
            {
                forum.Rating = (forum.Rating + commentDto.Star) / 2;
            }
            await _forumRepo.UpdateAsync(forumId, forum);
            var commentModel = commentDto.ToForumCommentFromCreateDto(appUser.Id, forumId);

            await _forumCommentRepo.CreateAsync(commentModel);

            return Ok(commentModel);
        }
        [HttpPut]
        [Route("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateCommentForumDto updateComment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var comments = await _forumCommentRepo.GetByIdAsync(id);
            if (appUser.Id != comments.UserId && !User.IsInRole("Admin"))
            {
                return BadRequest("You cannot edit other people's comments");
            }
            var commentModel = await _forumCommentRepo.UpdateAsync(id, updateComment.ToCommentFromUpdateDto());
            if (commentModel == null)
            {
                return NotFound();
            }
            return Ok(commentModel.ToCommentFOrumDto());

        }
    }
}