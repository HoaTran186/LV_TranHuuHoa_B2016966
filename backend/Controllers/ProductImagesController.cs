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
    [Route("api/productimages")]
    [ApiController]
    public class ProductImagesController : ControllerBase
    {
        private readonly IProductImagesRepository _productImagesRepo;
        private readonly IProductRepository _productRepo;
        private readonly IFileService _fileService;
        private readonly UserManager<AppUser> _userManager;
        public ProductImagesController(IProductImagesRepository productImagesRepo, IProductRepository productRepo, IFileService fileService, UserManager<AppUser> userManager)
        {
            _productImagesRepo = productImagesRepo;
            _productRepo = productRepo;
            _fileService = fileService;
            _userManager = userManager;
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
    }
}
