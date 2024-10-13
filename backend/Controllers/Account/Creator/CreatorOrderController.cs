using backend.Extensions;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Account.Creator
{
    [Route("api/creator/orders")]
    [ApiController]
    public class CreatorOrderController : ControllerBase
    {
        private readonly IOrdersRepository _ordersRepo;
        private readonly UserManager<AppUser> _userManager;
        private readonly IOrdersDetailsRepository _ordersDetailsRepo;
        private readonly IProductRepository _product;

        public CreatorOrderController(IOrdersRepository ordersRepo, UserManager<AppUser> userManager, IOrdersDetailsRepository ordersDetailsRepo
            , IProductRepository product)
        {
            _ordersRepo = ordersRepo;
            _userManager = userManager;
            _ordersDetailsRepo = ordersDetailsRepo;
            _product = product;
        }
        [HttpGet]
        [Authorize(Roles = "Creator")]
        public async Task<IActionResult> GetProductOrderCreator()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var order = await _ordersRepo.GetAllAsync();
            var product = await _product.GetUserProduct(appUser);
            var productId = product.Select(p => p.Id).ToList();
            var orderDetail = await _ordersDetailsRepo.GetByProductId(productId);
            var orderIds = orderDetail.Select(od => od.OrderId).Distinct().ToList();
            var orders = await _ordersRepo.GetOrdersByIds(orderIds);

            return Ok(orders);
        }
        [HttpPut("confirm/{orderId}")]
        [Authorize(Roles = "Creator")]
        public async Task<IActionResult> ConfirmOrShipOrder(int orderId)
        {
            var order = await _ordersRepo.GetByIdAsync(orderId);

            if (order == null)
            {
                return NotFound(new { Message = "Order not found" });
            }

            // Kiểm tra xem người dùng hiện tại có phải là chủ sở hữu sản phẩm trong đơn hàng không
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var products = await _product.GetUserProduct(appUser);
            var productIds = products.Select(p => p.Id).ToList();
            var orderDetails = await _ordersDetailsRepo.GetByProductId(productIds);

            if (!orderDetails.Any(od => od.OrderId == orderId))
            {
                return Forbid("You are not authorized to confirm this order.");
            }

            // Xử lý logic cập nhật trạng thái đơn hàng
            if (order.OrderStatus == "Pending")
            {
                order.OrderStatus = "Confirmed";
                await _ordersRepo.UpdateAsync(orderId, order);
                return Ok(new { Message = "Order confirmed successfully." });
            }
            else if (order.OrderStatus == "Confirmed")
            {
                order.OrderStatus = "Shipped";
                order.ShippedDate = DateTime.UtcNow;
                await _ordersRepo.UpdateAsync(orderId, order);
                return Ok(new { Message = "Order is now being shipped." });
            }
            else
            {
                return BadRequest(new { Message = "Order status is not valid for confirmation or shipping." });
            }
        }
    }
}