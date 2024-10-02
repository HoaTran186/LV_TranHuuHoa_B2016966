using backend.Dtos.Comment;
using backend.Extensions;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Crypto.Modes;
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

            var comments = await _commentRepo.GetByIdAsync(id);

            if (comments == null)
            {
                return NotFound("Comment not found.");
            }
            var productId = comments.productId;
            if (!productId.HasValue)
            {
                return BadRequest("Invalid productId associated with this comment.");
            }

            var product = await _productRepo.GetByIdAsync(productId.Value);

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            product.Rating = product.Rating * 2 - comments.Star;
            await _productRepo.UpdateAsync(product.Id, product);

            var comment = await _commentRepo.DeleteAsync(id);

            if (comment == null)
            {
                return NotFound("Error deleting the comment.");
            }

            return Ok("Comment deleted successfully.");
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
        [HttpDelete]
        [Route("by-product/{productId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProductId([FromRoute] int productId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productRepo.GetByIdAsync(productId);

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            // Reset product rating to zero
            product.Rating = 0;
            await _productRepo.UpdateAsync(productId, product);

            // Delete all comments associated with the productId
            await _commentRepo.DeleteByProductId(productId);

            return Ok("All comments associated with the product have been deleted.");
        }

    }
}