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
          public ProductController(IProductRepository productRepo, IProductTypeRepository productTypeRepo, UserManager<AppUser> userManager, ApplicationDBContext context)
          {
               _productTypeRepo = productTypeRepo;
               _productRepo = productRepo;
               _userManager = userManager;
               _context = context;
               _mlContext = new MLContext();

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

                    var products = query.ToList();

                    // Nếu không có sản phẩm nào từ database, trả về danh sách rỗng
                    if (products.Count == 0)
                    {
                         return Ok(new List<Product>());
                    }

                    // Bước 2: Nếu có productName, thực hiện fuzzy search
                    if (!string.IsNullOrEmpty(productName))
                    {
                         // Sử dụng FuzzySharp để tính điểm tương đồng giữa productName và tên sản phẩm
                         var fuzzyResults = products.Select(p => new
                         {
                              Product = p,
                              Similarity = FuzzySharp.Fuzz.PartialRatio(productName, p.Product_Name)
                         })
                         .Where(x => x.Similarity >= 70)  // Lọc sản phẩm có độ tương đồng >= 70%
                         .OrderByDescending(x => x.Similarity)  // Sắp xếp theo độ tương đồng giảm dần
                         .Select(x => x.Product)
                         .ToList();

                         return Ok(fuzzyResults);  // Trả về danh sách các sản phẩm tương tự
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
          [HttpGet("suggest-similar-ml/{productId}")]
          public async Task<IActionResult> SuggestSimilarProductsWithML(int productId)
          {
               // Lấy sản phẩm hiện tại từ CSDL
               var product = await _productRepo.GetByIdAsync(productId);

               if (product == null)
               {
                    return NotFound();
               }

               // Lấy tất cả các sản phẩm từ CSDL
               var allProducts = await _productRepo.GetAllProducts();

               // Xử lý văn bản và chuyển thành vector
               var mlContext = new MLContext();

               // Chuẩn bị dữ liệu
               var productData = allProducts.Select(p => new ProductData
               {
                    Id = p.Id,
                    CombinedText = p.Product_Name + " " + p.Origin + " " + p.Unique + " " + p.Apply
               }).ToList();

               // Chuyển sản phẩm hiện tại thành dữ liệu
               var currentProductData = new ProductData
               {
                    Id = product.Id,
                    CombinedText = product.Product_Name + " " + product.Origin + " " + product.Unique + " " + product.Apply
               };

               // Tạo pipeline để xử lý văn bản và tính toán TF-IDF
               var pipeline = mlContext.Transforms.Text.FeaturizeText(outputColumnName: "Features", inputColumnName: nameof(ProductData.CombinedText))
                               .Append(mlContext.Transforms.Concatenate("Features", "Features"));

               // Chuyển đổi dữ liệu thành IDataView
               var dataView = mlContext.Data.LoadFromEnumerable(productData);

               // Áp dụng pipeline
               var model = pipeline.Fit(dataView);
               var transformedData = model.Transform(dataView);

               // Tạo predictor cho tính toán cosine similarity
               var cosineSimilarity = new List<(ProductData product, float similarity)>();

               // Tạo engine để tính toán similarity
               var featureColumns = transformedData.GetColumn<float[]>("Features").ToArray();
               var currentProductFeature = model.Transform(mlContext.Data.LoadFromEnumerable(new[] { currentProductData }))
                                                   .GetColumn<float[]>("Features")
                                                   .First();

               // Ngưỡng để lọc các sản phẩm tương tự (ví dụ: chỉ hiển thị các sản phẩm có similarity lớn hơn 0.5)
               float threshold = 0.5f;

               // Tính toán độ tương đồng cosine và lọc theo ngưỡng
               for (int i = 0; i < productData.Count; i++)
               {
                    var similarity = ComputeCosineSimilarity(currentProductFeature, featureColumns[i]);

                    // Chỉ thêm các sản phẩm có similarity lớn hơn ngưỡng
                    if (similarity >= threshold && productData[i].Id != productId)
                    {
                         cosineSimilarity.Add((productData[i], similarity));
                    }
               }

               // Sắp xếp sản phẩm theo độ tương đồng cao nhất
               var similarProductIds = cosineSimilarity.OrderByDescending(x => x.similarity)
                                           .Select(x => x.product.Id)
                                           .ToList();

               var similarProducts = await _productRepo.GetProductsByIdsAsync(similarProductIds);
               return Ok(similarProducts);
          }

          // Hàm tính độ tương đồng cosine
          private float ComputeCosineSimilarity(float[] vector1, float[] vector2)
          {
               // Triển khai tính toán cosine similarity giữa hai vector đặc trưng
               float dotProduct = 0f;
               float magnitudeA = 0f;
               float magnitudeB = 0f;

               for (int i = 0; i < vector1.Length; i++)
               {
                    dotProduct += vector1[i] * vector2[i];
                    magnitudeA += vector1[i] * vector1[i];
                    magnitudeB += vector2[i] * vector2[i];
               }

               magnitudeA = (float)Math.Sqrt(magnitudeA);
               magnitudeB = (float)Math.Sqrt(magnitudeB);

               if (magnitudeA == 0 || magnitudeB == 0)
               {
                    return 0f;
               }

               return dotProduct / (magnitudeA * magnitudeB);
          }


          public class ProductData
          {
               public int Id { get; set; }
               public string CombinedText { get; set; }
          }
     }
}