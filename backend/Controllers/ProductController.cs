using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
    }
}