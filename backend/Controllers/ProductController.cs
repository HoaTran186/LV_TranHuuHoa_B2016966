using backend.Data;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using FuzzySharp;
using Microsoft.EntityFrameworkCore;
using backend.Helpers;
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
          public async Task<IActionResult> GetAll([FromQuery] QueryProduct queryProduct)
          {
               if (!ModelState.IsValid)
               {
                    return BadRequest(ModelState);
               }
               var products = await _productRepo.GetAllAsync(queryProduct);
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
          public ActionResult<IEnumerable<Product>> FuzzySearch(string productName = "", int? productTypeId = null, decimal? maxPrice = null)
          {
               // Bước 1: Lọc sơ bộ các sản phẩm trên database
               var query = _context.Products
                              .Include(c => c.ProductImages)
                              .Include(c => c.Comments)
                              .AsQueryable();

               if (productTypeId.HasValue)
               {
                    query = query.Where(p => p.ProductTypeId == productTypeId.Value);
               }

               if (maxPrice.HasValue)
               {
                    query = query.Where(p => p.Price <= maxPrice.Value);
               }

               // Bước 2: Chuyển dữ liệu từ database lên bộ nhớ để áp dụng Fuzzy Matching nếu có từ khóa
               var products = query.AsEnumerable();

               if (!string.IsNullOrEmpty(productName))
               {
                    // Áp dụng Fuzzy Matching khi có từ khóa
                    products = products
                        .Where(p =>
                            Fuzz.PartialRatio(p.Product_Name.ToLower(), productName.ToLower()) >= 70 ||
                            Fuzz.PartialRatio(p.Origin.ToLower(), productName.ToLower()) >= 70
                        );
               }

               // Bước 3: Trả về danh sách sản phẩm sau khi áp dụng các điều kiện
               return Ok(products.ToList());
          }


     }
}