using backend.Data;
using backend.Extensions;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Account.Users
{
    [Route("api/user/active")]
    [ApiController]
    public class ActiveController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly UserManager<AppUser> _userManager;
        public ActiveController(ApplicationDBContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        [HttpPost("view-product/{productId}")]
        public async Task<IActionResult> ViewProduct(string userId, int productId)
        {
            // Tìm sản phẩm
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound("Product not found");

            // Tìm hành động của người dùng với sản phẩm này
            var userProduct = await _context.ActiveUsers
                .FirstOrDefaultAsync(up => up.UserId == userId && up.ProductId == productId);

            // Nếu chưa có hành động thì tạo mới
            if (userProduct == null)
            {
                userProduct = new ActiveUser
                {
                    UserId = userId,
                    ProductId = productId,
                    HasViewed = true,
                    HasPurchased = false
                };
                _context.ActiveUsers.Add(userProduct);
            }
            else
            {
                // Nếu đã có, cập nhật trạng thái xem
                userProduct.HasViewed = true;
            }

            await _context.SaveChangesAsync();
            return Ok("Product viewed successfully");
        }
        [HttpPost("purchase-product/{productId}")]
        public async Task<IActionResult> PurchaseProduct(string userId, int productId)
        {
            // Tìm sản phẩm
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound("Product not found");

            // Tìm hành động của người dùng với sản phẩm này
            var userProduct = await _context.ActiveUsers
                .FirstOrDefaultAsync(up => up.UserId == userId && up.ProductId == productId);

            // Nếu chưa có hành động thì tạo mới
            if (userProduct == null)
            {
                userProduct = new ActiveUser
                {
                    UserId = userId,
                    ProductId = productId,
                    HasViewed = false,
                    HasPurchased = true
                };
                _context.ActiveUsers.Add(userProduct);
            }
            else
            {
                // Nếu đã có, cập nhật trạng thái mua
                userProduct.HasPurchased = true;
            }

            await _context.SaveChangesAsync();
            return Ok("Product purchased successfully");
        }
        [HttpGet("recommend-for-user/{userId}")]
        public async Task<ActionResult<IEnumerable<Product>>> RecommendForUser(string userId)
        {

            var userActions = await _context.ActiveUsers
                .Where(up => up.UserId == userId && (up.HasViewed || up.HasPurchased))
                .Select(up => up.ProductId)
                .ToListAsync();

            if (userActions == null || !userActions.Any())
            {
                return NotFound("No actions found for the user");
            }

            // Lấy những sản phẩm mà người dùng khác đã xem hoặc mua với những sản phẩm tương tự
            var otherUsersProducts = await _context.ActiveUsers
                .Where(up => userActions.Contains(up.ProductId) && up.UserId != userId && (up.HasViewed || up.HasPurchased))
                .Select(up => up.ProductId)
                .Distinct()
                .ToListAsync();

            if (!otherUsersProducts.Any())
            {
                return NotFound("No similar user actions found");
            }

            // Gợi ý các sản phẩm tương tự
            var recommendedProducts = await _context.Products
                .Where(p => otherUsersProducts.Contains(p.Id) && p.Censor == true)
                .Include(p => p.ProductType)
                .Include(p => p.ProductImages)
                .Take(3)  // Giới hạn số lượng sản phẩm gợi ý
                .ToListAsync();

            return Ok(recommendedProducts);
        }

    }
}