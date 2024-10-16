using backend.Dtos.Orders.Details;
using backend.Extensions;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Crypto.Modes;

namespace backend.Controllers.Admin
{
    [Route("api/admin/orders-details")]
    public class OrderDetailController : ControllerBase
    {
        private readonly IOrdersRepository _ordersRepo;
        private readonly IOrdersDetailsRepository _ordersDetailsRepo;
        private readonly IProductRepository _product;
        private readonly UserManager<AppUser> _userManager;
        public OrderDetailController(IOrdersDetailsRepository ordersDetailsRepo, IOrdersRepository ordersRepo
        , IProductRepository product, UserManager<AppUser> userManager)
        {
            _ordersRepo = ordersRepo;
            _ordersDetailsRepo = ordersDetailsRepo;
            _product = product;
            _userManager = userManager;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var orderdetails = await _ordersDetailsRepo.GetAllAsync();

            return Ok(orderdetails);
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var orderdetail = await _ordersDetailsRepo.GetByIdAsync(id);
            if (orderdetail == null)
            {
                return NotFound();
            }
            return Ok(orderdetail.ToOrderDetailsDto());
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderDetailsDto createOrderDetails)
        {
            var product = await _product.GetByIdAsync(createOrderDetails.ProductId);
            if (product == null) return NotFound("Product not found.");

            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            if (appUser == null) return NotFound("User not found.");

            // Tìm đơn hàng "Buying" của người dùng và người bán
            var targetOrder = await _ordersRepo.GetPendingOrderByUserIdAndSellerIdAsync(appUser.Id, product.UserId);

            // Kiểm tra trạng thái của đơn hàng
            if (targetOrder != null && targetOrder.OrderStatus != "Buying")
            {
                // Nếu đơn hàng không ở trạng thái "Buying", tạo một đơn hàng mới
                targetOrder = new Orders { UserId = appUser.Id, OrderStatus = "Buying", OrderDate = DateTime.Now };
                await _ordersRepo.CreateAsync(targetOrder);
            }
            else if (targetOrder == null)
            {
                // Nếu không có đơn hàng "Buying" nào, tạo mới đơn hàng
                targetOrder = new Orders { UserId = appUser.Id, OrderStatus = "Buying", OrderDate = DateTime.Now };
                await _ordersRepo.CreateAsync(targetOrder);
            }

            // Kiểm tra chi tiết đơn hàng cho sản phẩm này trong đơn hàng hiện tại
            var existingOrderDetail = await _ordersDetailsRepo.GetByProductIdAndOrderIdAsync(createOrderDetails.ProductId, targetOrder.Id);

            if (existingOrderDetail != null)
            {
                // Cập nhật chi tiết đơn hàng hiện tại
                existingOrderDetail.Quantity += createOrderDetails.Quantity;
                existingOrderDetail.UnitPrice = product.Price * existingOrderDetail.Quantity;
                await _ordersDetailsRepo.UpdateAsync(existingOrderDetail.Id, existingOrderDetail);
            }
            else
            {
                // Tạo mới chi tiết đơn hàng
                var unitPrice = product.Price * createOrderDetails.Quantity;
                var newOrderDetail = createOrderDetails.ToOrderFromCreateDto(unitPrice);
                newOrderDetail.OrdersId = targetOrder.Id; // Gán OrderId rõ ràng
                await _ordersDetailsRepo.CreateAsync(newOrderDetail);
            }

            // Cập nhật số lượng sản phẩm
            var newQuantityProduct = product.Quantity - createOrderDetails.Quantity;
            if (newQuantityProduct < 0) return BadRequest("Product quantity is not enough");
            product.Quantity = newQuantityProduct;
            await _product.UpdateAsync(createOrderDetails.ProductId, product);

            // Cập nhật tổng giá trị đơn hàng
            targetOrder.TotalAmount = await _ordersDetailsRepo.GetTotalPriceByOrderIdAsync(targetOrder.Id);
            await _ordersRepo.UpdateAsync(targetOrder.Id, targetOrder);

            return Ok();
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateOrderDetailsDto updateOrderDetails)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Lấy thông tin sản phẩm
            var product = await _product.GetByIdAsync(updateOrderDetails.ProductId);
            if (product == null)
            {
                return NotFound();
            }

            // Lấy thông tin chi tiết đơn hàng hiện tại
            var orderdetail = await _ordersDetailsRepo.GetByIdAsync(id);
            if (orderdetail == null)
            {
                return NotFound();
            }

            // Cập nhật số lượng sản phẩm
            var quantityProduct = product.Quantity + orderdetail.Quantity;
            product.Quantity = quantityProduct;
            var unitPrice = product.Price * updateOrderDetails.Quantity;
            quantityProduct = product.Quantity - updateOrderDetails.Quantity;

            if (quantityProduct >= 0)
            {
                product.Quantity = quantityProduct;
                await _product.UpdateAsync(updateOrderDetails.ProductId, product);
            }
            else
            {
                return Ok("Product quantity is not enough");
            }

            // Cập nhật chi tiết đơn hàng
            var updatedOrderDetail = await _ordersDetailsRepo.UpdateAsync(id, updateOrderDetails.ToOrderFromUpdateDto(updateOrderDetails.ProductId, unitPrice));
            if (updatedOrderDetail == null)
            {
                return NotFound();
            }

            // Tính tổng số tiền của đơn hàng
            var orderId = updatedOrderDetail.OrdersId;
            var orderDetails = await _ordersDetailsRepo.GetByOrderIdAsync(orderId); // Giả sử bạn có phương thức này để lấy tất cả chi tiết đơn hàng của một đơn hàng.

            decimal totalAmount = 0;
            foreach (var detail in orderDetails)
            {
                totalAmount = totalAmount + detail.UnitPrice;
            }

            var order = await _ordersRepo.GetByIdAsync(orderId);
            if (order == null)
            {
                return NotFound();
            }
            order.TotalAmount = totalAmount;
            await _ordersRepo.UpdateAsync(orderId, order);

            return Ok(updatedOrderDetail.ToOrderDetailsDto());
        }

        [HttpDelete]
        [Route("delete/{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var orderdetail = await _ordersDetailsRepo.GetByIdAsync(id);
            var product = await _product.GetByIdAsync(orderdetail.ProductId);
            var quantity = product.Quantity + orderdetail.Quantity;
            product.Quantity = quantity;
            await _product.UpdateAsync(orderdetail.ProductId, product);
            var orderdetailsModel = await _ordersDetailsRepo.DeleteAsync(id);
            if (orderdetailsModel == null)
            {
                return NotFound();
            }
            return Ok("Deleted Order details");
        }
        [HttpDelete]
        [Route("delete-all/{orderId:int}")]
        public async Task<IActionResult> DeleteOrderId([FromRoute] int orderId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var orderDetails = await _ordersDetailsRepo.GetByOrderIdAsync(orderId);
            if (orderDetails == null || !orderDetails.Any())
            {
                return NotFound();
            }

            foreach (var orderDetail in orderDetails)
            {
                var product = await _product.GetByIdAsync(orderDetail.ProductId);
                var quantity = product.Quantity + orderDetail.Quantity;
                product.Quantity = quantity;
                await _product.UpdateAsync(orderDetail.ProductId, product);
            }

            var result = await _ordersDetailsRepo.DeleteOrdersAsync(orderId);
            if (result == null)
            {
                return NotFound();
            }

            return Ok("Deleted all order details with the given order ID");
        }

    }
}