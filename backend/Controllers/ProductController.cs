using backend.Data;
using backend.Dtos.Product;
using backend.Extensions;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
     [Route("api/product")]
     [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductTypeRepository _productTypeRepo;
        private readonly IProductRepository _productRepo;
        private readonly UserManager<AppUser> _userManager;

       public ProductController(IProductRepository productRepo, IProductTypeRepository productTypeRepo, UserManager<AppUser> userManager)
       {
          _productTypeRepo = productTypeRepo;
          _productRepo = productRepo;
          _userManager = userManager;
       }
       [HttpGet]
       public async Task<IActionResult> GetAll()
       {
          if(!ModelState.IsValid)
          {
               return BadRequest(ModelState);
          }
        var products =await _productRepo.GetAllAsync();
        var productDto = products.Select(s => s.ToProductDto());

        return Ok(products);
       }
       [HttpGet("{id:int}")]
       public async Task<IActionResult> GetById([FromRoute] int id)
       {
          if(!ModelState.IsValid)
          {
               return BadRequest(ModelState);
          }  
          var product = await _productRepo.GetByIdAsync(id);
          if(product == null)
          {
               return NotFound();
          }

          return Ok(product.ToProductDto());
       }
       [HttpPost]
       [Authorize]
       public async Task<IActionResult> Create([FromBody] CreateProductRequestDto productDto)
       {
          if(!ModelState.IsValid)
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
       public async Task<IActionResult> Update([FromRoute] int id,[FromBody] UpdateProductDto updateDto)
       {
          if(!ModelState.IsValid)
          {
               return BadRequest(ModelState);
          }
          var productModel = await _productRepo.UpdateAsync(id, updateDto.ToProductFromUpdateDto());
          if (productModel == null)
          {
               return NotFound();
          }
          return Ok(productModel.ToProductDto());
       }
       [HttpPost]
       [Route("{id:int}")]
       [Authorize(Roles = "Admin")]
       public async Task<IActionResult> UpdateCensor([FromRoute]int id, [FromBody] UpdateCensorDto updateCensorDto)
       {
          if(!ModelState.IsValid)
          {
               return BadRequest(ModelState);
          }
          var productCensor = await _productRepo.UpdateCensor(id, updateCensorDto.ToProductFromUpdateCensorDto());
          if(productCensor == null)
          {
               return NotFound();
          }
          return Ok(productCensor.ToProductDto());
       }
       [HttpDelete]
       [Route("{id:int}")]
       [Authorize()]
       public async Task<IActionResult> Delete([FromRoute] int id)
       {
          if(!ModelState.IsValid)
          {
               return BadRequest(ModelState);
          }
          var productModel = await _productRepo.DeleteAsync(id);
          if(productModel == null)
          {
               return NotFound();
          }
          return Ok("Deleted Product");
       }
    }
}