using backend.Dtos.Comment;
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
    [Route("api/account/comment")]
    [ApiController]
    public class UserCommentController : ControllerBase
    {
        private readonly IProductRepository _productRepo;
        private readonly ICommentRepository _commentRepo;
        private readonly UserManager<AppUser> _userManager;
        public UserCommentController(IProductRepository productRepo, ICommentRepository commentRepo, UserManager<AppUser> userManager)
        {
            _productRepo = productRepo;
            _commentRepo = commentRepo;
            _userManager = userManager;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] QueryComment queryComment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var comments = await _commentRepo.GetAllAsync(queryComment);
            return Ok(comments);
        }
        [HttpGet("{productId:int}")]
        public async Task<IActionResult> GetById([FromRoute] int productId, [FromQuery] QueryComment queryComment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var comments = await _commentRepo.GetByProductIdAsync(productId, queryComment);
            if (comments == null)
            {
                return NotFound();
            }
            return Ok(comments);
        }
        [HttpPost("{productId:int}")]
        [Authorize]
        public async Task<IActionResult> Create([FromRoute] int productId, CreateCommentDto commentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!await _productRepo.ProductExists(productId))
            {
                return BadRequest("Product does not exist");
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var product = await _productRepo.GetByIdAsync(productId);
            if (product.Rating == 0)
            {
                product.Rating = commentDto.Star;
            }
            else
            {
                product.Rating = (product.Rating + commentDto.Star) / 2;
            }
            await _productRepo.UpdateAsync(productId, product);
            var commentModel = commentDto.ToCommentFromCreateDto(productId, appUser.Id);

            await _commentRepo.CreateAsync(commentModel);

            return Ok(commentModel);
        }
        [HttpPut]
        [Route("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateCommentDto updateComment)
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
                return BadRequest("You cannot edit other people's comments");
            }
            var commentModel = await _commentRepo.UpdateAsync(id, updateComment.ToCommentFromUpdateDto());
            if (commentModel == null)
            {
                return NotFound();
            }
            return Ok(commentModel.ToCommentDto());

        }
    }
}