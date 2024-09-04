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
        private readonly IFileService _fileService;
        public ProductImagesController(IProductImagesRepository productImagesRepo, IProductRepository productRepo, IFileService fileService)
        {
            _productImagesRepo = productImagesRepo;
            _productRepo = productRepo;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var productImages = await _productImagesRepo.GetAllAsync();
            
            return Ok(productImages);
        }
        // [HttpGet("{id:int}")]
        // public async Task<IActionResult> GetById([FromRoute] int id)
        // {
        //     if(!ModelState.IsValid)
        //     {
        //         return BadRequest(ModelState);
        //     }
        //     var productImages = await _productImagesRepo.GetByIdAsync(id);
        //     if(productImages == null)
        //     {
        //         return NotFound();
        //     }
        //     return Ok(productImages);
        // }
        [HttpGet("{productId:int}")]
        public async Task<IActionResult> GetByProductId([FromRoute] int productId)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var productImages = await _productImagesRepo.GetByProductId(productId);
            if(productImages == null)
            {
                return NotFound();
            }
            return Ok(productImages);
        }
        [HttpPost("{productId}")]
        public async Task<IActionResult> Create([FromRoute] int productId,[FromForm] CreateProductImagesDto productImages)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if(!await _productRepo.ProductExists(productId))
            {
                return BadRequest("Product does not exist");
            }
            string[]  allowedFileExtentions = [".jpg", ".jpeg", ".png"];
            string  createdImageName = await _fileService.SaveFileAsync(productImages.Images, allowedFileExtentions);
            var productModel = new ProductImages
            {
                Images = createdImageName,
                ProductId = productId
            };
            await _productImagesRepo.CreateAsync(productModel);
            
            return Ok(productModel);
        }
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
             var existingProductImage = await _productImagesRepo.GetByIdAsync(id);
    
            if (existingProductImage == null)
            {
                return NotFound(); // Trả về 404 nếu không tìm thấy hình ảnh sản phẩm
            }

            var deleteResult = await _productImagesRepo.DeleteAsync(id);
    
            if (deleteResult == null)
            {
                return NotFound(); // Trả về 404 nếu việc xóa thất bại (tùy thuộc vào cách DeleteAsync hoạt động)
            }

            _fileService.DeleteFile(existingProductImage.Images);
            return Ok("Deleted product images");
        }
    }
}
