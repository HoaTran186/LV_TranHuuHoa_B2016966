using System.Data;
using backend.Dtos.Product.ProductImages;
using backend.Extensions;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/creator/product-images")]
    [ApiController]
    public class UserProductImagesController : ControllerBase
    {
        private readonly IProductImagesRepository _productImagesRepo;
        private readonly IProductRepository _productRepo;
        private readonly IFileService _fileService;
        private readonly UserManager<AppUser> _userManager;
        public UserProductImagesController(IProductImagesRepository productImagesRepo, IProductRepository productRepo, IFileService fileService, UserManager<AppUser> userManager)
        {
            _productImagesRepo = productImagesRepo;
            _productRepo = productRepo;
            _fileService = fileService;
            _userManager = userManager;
        }
        [HttpPost("{productId}")]
        [Authorize(Roles = "Creator")]
        public async Task<IActionResult> Create([FromRoute] int productId, [FromForm] CreateProductImagesDto productImages)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var product = await _productRepo.GetByIdAsync(productId);
            if (!await _productRepo.ProductExists(productId))
            {
                return BadRequest("Product does not exist");
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            if (product.UserId != appUser.Id)
            {
                return BadRequest("You are not authorized to upload images for this product.");
            }
            string[] allowedFileExtentions = [".jpg", ".jpeg", ".png"];
            string createdImageName = await _fileService.SaveFileAsync(productImages.Images, allowedFileExtentions);
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
        [Authorize(Roles = "Creator")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var existingProductImage = await _productImagesRepo.GetByIdAsync(id);

            if (existingProductImage == null)
            {
                return NotFound();
            }
            var product = await _productRepo.GetByIdAsync(existingProductImage.ProductId);
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            if (product.UserId != appUser.Id)
            {
                return BadRequest("You are not authorized to delete images for this product.");
            }
            var deleteResult = await _productImagesRepo.DeleteAsync(id);

            if (deleteResult == null)
            {
                return NotFound();
            }

            _fileService.DeleteFile(existingProductImage.Images);
            return Ok("Deleted product images");
        }
        [HttpDelete("delete-all/{productId}")]
        [Authorize(Roles = "Creator")]
        public async Task<IActionResult> DeleteAll([FromRoute] int productId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productRepo.GetByIdAsync(productId);
            if (product == null)
            {
                return NotFound("Product does not exist.");
            }

            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            if (product.UserId != appUser.Id)
            {
                return BadRequest("You are not authorized to delete images for this product.");
            }

            var productImages = await _productImagesRepo.GetByProductId(productId);
            if (productImages == null || !productImages.Any())
            {
                return NotFound("No images found for this product.");
            }


            foreach (var image in productImages)
            {
                _fileService.DeleteFile(image.Images);

                await _productImagesRepo.DeleteAsync(image.Id);
            }

            return Ok("Deleted all product images.");
        }

    }
}
