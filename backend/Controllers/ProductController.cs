using backend.Data;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using FuzzySharp;
namespace backend.Controllers
{
     [Route("api/product")]
     [ApiController]
     public class ProductController : ControllerBase
     {
          private readonly IProductTypeRepository _productTypeRepo;
          private readonly IProductRepository _productRepo;
          private readonly UserManager<AppUser> _userManager;
          private readonly ApplicationDBContext _context;

          public ProductController(IProductRepository productRepo, IProductTypeRepository productTypeRepo, UserManager<AppUser> userManager, ApplicationDBContext context)
          {
               _productTypeRepo = productTypeRepo;
               _productRepo = productRepo;
               _userManager = userManager;
               _context = context;
          }
          [HttpGet]
          public async Task<IActionResult> GetAll()
          {
               if (!ModelState.IsValid)
               {
                    return BadRequest(ModelState);
               }
               var products = await _productRepo.GetAllAsync();
               var productDto = products.Select(s => s.ToProductDto());

               return Ok(productDto);
          }
          [HttpGet("{id:int}")]
          public async Task<IActionResult> GetById([FromRoute] int id)
          {
               if (!ModelState.IsValid)
               {
                    return BadRequest(ModelState);
               }
               var product = await _productRepo.GetByIdAsync(id);
               if (product == null)
               {
                    return NotFound();
               }

               return Ok(product.ToProductDto());
          }
          [HttpGet("search-product")]
          public ActionResult<IEnumerable<Product>> FuzzySearch(string query, int threshold = 80)
          {
               if (string.IsNullOrEmpty(query))
               {
                    return BadRequest("Search query cannot be empty.");
               }

               var products = _context.Products.AsEnumerable()
        .Where(p => Fuzz.PartialRatio(p.Product_Name.ToLower(), query.ToLower()) >= threshold ||
                    Fuzz.PartialRatio(p.Origin.ToLower(), query.ToLower()) >= threshold)
        .ToList();


               return Ok(products);
          }
     }
}