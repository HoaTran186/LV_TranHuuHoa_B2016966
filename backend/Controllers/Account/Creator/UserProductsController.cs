using backend.Dtos.Product;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Account.Creator
{
    [Route("api/creator/products")]
    [ApiController]
    public class UserProductsController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IProductRepository _productRepo;
        private readonly IUserProductRepository _userProductRepo;

        public UserProductsController(UserManager<AppUser> userManager, IProductRepository productRepo, IUserProductRepository userProductRepo)
        {
            _userManager = userManager;
            _productRepo = productRepo;
            _userProductRepo = userProductRepo;
        }
        [HttpGet]
        [Authorize(Roles = "Creator")]
        public async Task<IActionResult> GetAllUser([FromQuery] QueryProduct queryProduct)
        {
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var userProduct = await _productRepo.GetUserProduct(appUser, queryProduct);
            return Ok(userProduct);
        }
        [HttpGet]
        [Route("{id:int}")]
        [Authorize(Roles = "Creator")]
        public async Task<IActionResult> GetUserProductId([FromRoute] int id)
        {
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var product = await _productRepo.GetUserProductById(appUser, id);
            if (product == null)
            {
                return NotFound(new { Message = "Product is not found." });
            }
            return Ok(product);
        }
        [HttpPost]
        [Authorize(Roles = "Creator")]
        public async Task<IActionResult> Create([FromBody] CreateProductRequestDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var productModel = productDto.ToProductFromCreateDto(appUser.Id);
            await _productRepo.CreateAsync(productModel);

            return Ok(productModel);
        }
        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "Creator")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateProductDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var existingProduct = await _productRepo.GetByIdAsync(id);
            if (existingProduct == null)
            {
                return NotFound();
            }

            if (existingProduct.UserId != appUser.Id)
            {
                return BadRequest("You do not have permission to update this product.");
            }
            var productModel = await _productRepo.UpdateAsync(id, updateDto.ToUserProductFromUpdateDto(appUser.Id));
            if (productModel == null)
            {
                return NotFound();
            }
            return Ok(productModel.ToProductDto());
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
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var existingProduct = await _productRepo.GetByIdAsync(id);
            if (existingProduct == null)
            {
                return NotFound();
            }

            if (existingProduct.UserId != appUser.Id)
            {
                return BadRequest("You do not have permission to delete this product.");
            }
            var userProductModel = await _productRepo.DeleteAsync(id);
            if (userProductModel == null)
            {
                return NotFound();
            }
            return Ok("Deleted Product");
        }
    }
}