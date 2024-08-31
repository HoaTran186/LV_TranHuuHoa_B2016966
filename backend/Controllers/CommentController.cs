using backend.Dtos.Comment;
using backend.Interfaces;
using backend.Mappers;
using Microsoft.AspNetCore.Mvc;
namespace backend.Controllers
{
    [Route("api/comment")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly IProductRepository _productRepo;
        private readonly ICommentRepository _commentRepo;
        public CommentController(IProductRepository productRepo, ICommentRepository commentRepo)
        {
            _productRepo = productRepo;
            _commentRepo = commentRepo;
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
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var comments = await _commentRepo.GetByIdAsync(id);
            if(comments == null)
            {
                return NotFound();
            }
            return Ok(comments);
        }
        [HttpPost("{productId:int}")]
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
            var commentModel = commentDto.ToCommentFromCreateDto(productId);
            await _commentRepo.CreateAsync(commentModel);

            return Ok(commentModel);
        }
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
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