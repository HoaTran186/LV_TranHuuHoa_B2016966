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
    [Route("api/admin/comment")]
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
        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var comments = await _commentRepo.GetByIdAsync(id);
            if (appUser.Id != comments.UserId && !User.IsInRole("Admin"))
            {
                return BadRequest("You cannot delete other people's comments");
            }
            var comment = await _commentRepo.DeleteAsync(id);
            if (comment == null)
            {
                return NotFound();
            }
            return Ok("Deleted commment");
        }
        [HttpDelete("delete-all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAll()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _commentRepo.DeleteAllAsync();

            return Ok("All comments have been deleted.");
        }

    }
}