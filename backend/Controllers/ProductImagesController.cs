using System.Data;
using backend.Dtos.Product.ProductImages;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/productimages")]
    [ApiController]
    public class ProductImagesController : ControllerBase
    {
        private readonly IProductImagesRepository _productImagesRepo;
        private readonly IProductRepository _productRepo;
        public ProductImagesController(IProductImagesRepository productImagesRepo, IProductRepository productRepo)
        {
            _productImagesRepo = productImagesRepo;
            _productRepo = productRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var productImages = await _productImagesRepo.GetAllAsync();
            // var productImagesDto = productImages.Select(s => s.ToProductImagesDto());
            return Ok(productImages);
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var productImages = await _productImagesRepo.GetByIdAsync(id);
            if(productImages == null)
            {
                return NotFound();
            }
            return Ok(productImages);
        }
        [HttpPost("{productId}")]
        public async Task<IActionResult> Create([FromRoute] int productId, CreateProductImagesDto productImages)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if(!await _productRepo.ProductExists(productId))
            {
                return BadRequest("Product does not exist");
            }
            var productImagesModel = productImages.ToProductImagesFromCreate(productId);
            await _productImagesRepo.CreateAsync(productImagesModel);
            
            return Ok(productImagesModel);
        }
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var productImages = await _productImagesRepo.DeleteAsync(id);
            if(productImages == null)
            {
                return NotFound();
            }
            return Ok("Deleted product images");
        }
    }
}
