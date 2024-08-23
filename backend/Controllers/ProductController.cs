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
        private readonly ApplicationDBContext _context;
        private readonly IProductRepository _productRepo;
       public ProductController(ApplicationDBContext context, IProductRepository productRepo)
       {
            _context = context;
            _productRepo = productRepo;
       }
       [HttpGet]
       public async Task<IActionResult> GetAll()
       {
        var products =await _productRepo.GetAllAsync();

        return Ok(products);
       }
       [HttpGet("{id:int}")]
       public async Task<IActionResult> GetById([FromRoute] int id)
       {
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
          var productModel = productDto.ToProductFromCreateDto();
          await _productRepo.CreateAsync(productModel);

          return Ok(productModel);
       }
       [HttpPut]
       [Route("{id}")]
       public async Task<IActionResult> Update([FromRoute] int id,[FromBody] UpdateProductDto updateDto)
       {
          var productModel = await _productRepo.UpdateAsync(id, updateDto);
          if (productModel == null)
          {
               return NotFound();
          }
          return Ok(productModel.ToProductDto());
       }
       [HttpDelete]
       [Route("{id}")]
       public async Task<IActionResult> Delete([FromRoute] int id)
       {
          var productModel = await _productRepo.DeleteAsync(id);
          if(productModel == null)
          {
               return NotFound();
          }
          return Ok("Deleted Product");
       }
    }
}