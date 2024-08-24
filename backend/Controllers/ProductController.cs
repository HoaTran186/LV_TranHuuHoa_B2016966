using backend.Data;
using backend.Dtos.Product;
using backend.Interfaces;
using backend.Mappers;
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
       public ProductController(IProductRepository productRepo, IProductTypeRepository productTypeRepo)
       {
          _productTypeRepo = productTypeRepo;
          _productRepo = productRepo;
       }
       [HttpGet]
       public async Task<IActionResult> GetAll()
       {
          if(!ModelState.IsValid)
          {
               return BadRequest(ModelState);
          }
        var products =await _productRepo.GetAllAsync();

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
       public async Task<IActionResult> Create([FromBody] CreateProductRequestDto productDto)
       {
          if(!ModelState.IsValid)
          {
               return BadRequest(ModelState);
          }
          var productModel = productDto.ToProductFromCreateDto();
          await _productRepo.CreateAsync(productModel);

          return Ok(productModel);
       }
       [HttpPut]
       [Route("{id:int}")]
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
       [HttpDelete]
       [Route("{id:int}")]
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