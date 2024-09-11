using backend.Dtos.Product;
using backend.Extensions;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Admin
{
     [Route("api/admin/product")]
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
       [HttpPost]
       [Authorize(Roles = "Admin")]
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
       [Authorize(Roles = "Admin")]
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
       [Authorize(Roles = "Admin")]
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