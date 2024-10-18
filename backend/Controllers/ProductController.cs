using backend.Data;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using FuzzySharp;
using Microsoft.EntityFrameworkCore;
using backend.Helpers;
using Microsoft.ML.Data;
using Microsoft.ML;
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
          private readonly MLContext _mlContext;
          private readonly IEstimator<ITransformer> _pipeline;
          public ProductController(IProductRepository productRepo, IProductTypeRepository productTypeRepo, UserManager<AppUser> userManager, ApplicationDBContext context)
          {
               _productTypeRepo = productTypeRepo;
               _productRepo = productRepo;
               _userManager = userManager;
               _context = context;
               _mlContext = new MLContext();
               _pipeline = _mlContext.Transforms.Text.FeaturizeText("Features", nameof(ProductInput.Name));
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
          public ActionResult<IEnumerable<Product>> MLNetSearch(string productName = "", int? productTypeId = null, decimal? maxPrice = null)
          {
               try
               {
                    // Bước 1: Lọc sơ bộ các sản phẩm từ database theo productTypeId và maxPrice
                    var query = _context.Products
                                        .AsNoTracking()
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

                    // Lọc theo productName chứa chuỗi tìm kiếm (không phân biệt hoa thường)
                    if (!string.IsNullOrEmpty(productName))
                    {
                         string searchLower = productName.ToLower();  // Chuyển chuỗi tìm kiếm sang chữ thường
                         query = query.Where(p => p.Product_Name.ToLower().Contains(searchLower));  // So sánh không phân biệt chữ hoa chữ thường
                    }

                    var products = query.ToList();

                    // Nếu không có sản phẩm nào từ database, trả về danh sách rỗng
                    if (products.Count == 0)
                    {
                         return Ok(new List<Product>());
                    }

                    // Bước 2: Nếu có productName, thực hiện tiếp vector hóa và tính toán độ tương đồng
                    if (!string.IsNullOrEmpty(productName))
                    {
                         // Chuẩn bị dữ liệu sản phẩm để vector hóa
                         var productData = products.Select(p => new ProductInput { Name = p.Product_Name }).ToList();
                         var dataView = _mlContext.Data.LoadFromEnumerable(productData);

                         // Xây dựng pipeline ML.NET
                         var _pipeline = _mlContext.Transforms.Text.FeaturizeText("Features", nameof(ProductInput.Name))
                                             .Append(_mlContext.Transforms.NormalizeLpNorm("Features"));  // Normalize text features

                         var model = _pipeline.Fit(dataView);

                         // Vector hóa tên sản phẩm trong database
                         var transformedData = model.Transform(dataView);
                         var productVectors = _mlContext.Data.CreateEnumerable<ProductVector>(transformedData, reuseRowObject: false).ToList();

                         // Vector hóa từ khóa tìm kiếm
                         var searchData = new List<ProductInput> { new ProductInput { Name = productName } };
                         var searchView = _mlContext.Data.LoadFromEnumerable(searchData);
                         var searchVectorData = model.Transform(searchView);
                         var searchVector = _mlContext.Data.CreateEnumerable<ProductVector>(searchVectorData, reuseRowObject: false).FirstOrDefault();

                         // Kiểm tra nếu không tìm thấy vector cho từ khóa tìm kiếm
                         if (searchVector == null)
                         {
                              return Ok(new List<Product>());  // Trả về danh sách rỗng nếu không có sản phẩm phù hợp
                         }

                         // Bước 3: Tính toán độ tương đồng Cosine giữa vector từ khóa và từng vector sản phẩm
                         var similarProducts = products.Zip(productVectors, (product, vector) => new
                         {
                              Product = product,
                              Similarity = CosineSimilarity(searchVector.Features, vector.Features)
                         })
                         .Where(x => x.Similarity >= 0.1)  // Lọc sản phẩm có độ tương đồng >= 0.1
                         .OrderByDescending(x => x.Similarity)  // Sắp xếp theo độ tương đồng giảm dần
                         .Select(x => x.Product)
                         .ToList();

                         return Ok(similarProducts);  // Trả về danh sách các sản phẩm tương tự
                    }

                    return Ok(products);  // Trả về danh sách các sản phẩm nếu không có tìm kiếm từ khóa
               }
               catch (ArgumentOutOfRangeException ex)
               {
                    // Xử lý lỗi schema mismatch và trả về thông báo lỗi
                    return BadRequest("Có lỗi xảy ra trong quá trình tìm kiếm. Vui lòng kiểm tra lại từ khóa.");
               }
               catch (Exception ex)
               {
                    // Xử lý lỗi khác và trả về thông báo lỗi
                    return StatusCode(500, "Đã có sự cố xảy ra. Vui lòng thử lại sau.");
               }
          }




          public class ProductInput
          {
               public string Name { get; set; }
          }
          public class ProductVector
          {
               [VectorType]
               public float[] Features { get; set; }
          }
          private float CosineSimilarity(float[] vectorA, float[] vectorB)
          {
               float dotProduct = 0;
               float magnitudeA = 0;
               float magnitudeB = 0;

               for (int i = 0; i < vectorA.Length; i++)
               {
                    dotProduct += vectorA[i] * vectorB[i];
                    magnitudeA += vectorA[i] * vectorA[i];
                    magnitudeB += vectorB[i] * vectorB[i];
               }

               float magnitude = (float)(Math.Sqrt(magnitudeA) * Math.Sqrt(magnitudeB));
               if (magnitude == 0)
               {
                    return 0;
               }
               return dotProduct / magnitude;
          }

     }
}