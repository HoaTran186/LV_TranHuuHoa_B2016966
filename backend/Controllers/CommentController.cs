using backend.Dtos.Comment;
using backend.Extensions;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
namespace backend.Controllers
{
    [Route("api/comment")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly IProductRepository _productRepo;
        private readonly ICommentRepository _commentRepo;
        private readonly UserManager<AppUser> _userManager;
        public CommentController(IProductRepository productRepo, ICommentRepository commentRepo, UserManager<AppUser> userManager)
        {
            _productRepo = productRepo;
            _commentRepo = commentRepo;
            _userManager = userManager;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var comments = await _commentRepo.GetAllAsync();
            return Ok(comments);
        }
        [HttpGet("{productId:int}")]
        public async Task<IActionResult> GetById([FromRoute] int productId)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var comments = await _commentRepo.GetByProductIdAsync(productId);
            if(comments == null)
            {
                return NotFound();
            }
            return Ok(comments);
        }
        [HttpPost("{productId:int}")]
        [Authorize]
        public async Task<IActionResult> Create([FromRoute] int productId, CreateCommentDto commentDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if(!await _productRepo.ProductExists(productId))
            {
                return BadRequest("Product does not exist");
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var commentModel = commentDto.ToCommentFromCreateDto(productId, appUser.Id);
            await _commentRepo.CreateAsync(commentModel);

            return Ok(commentModel);
        }
        [HttpPut]
        [Route("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateCommentDto updateComment)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var comments = await _commentRepo.GetByIdAsync(id);
            if(appUser.Id != comments.UserId && !User.IsInRole("Admin"))
            {
                return BadRequest("You cannot edit other people's comments");
            }
            var commentModel = await _commentRepo.UpdateAsync(id,updateComment.ToCommentFromUpdateDto());
            if(commentModel == null)
            {
                return NotFound();
            }
            return Ok(commentModel.ToCommentDto());

        }
        [HttpDelete]
        [Route("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var comments = await _commentRepo.GetByIdAsync(id);
            if(appUser.Id != comments.UserId && !User.IsInRole("Admin"))
            {
                return BadRequest("You cannot delete other people's comments");
            }
            var comment = await _commentRepo.DeleteAsync(id);
            if(comment == null)
            {
                return NotFound();
            }
            return Ok("Deleted commment");
        }
    }
}