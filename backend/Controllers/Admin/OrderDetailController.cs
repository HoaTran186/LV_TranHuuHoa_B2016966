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

            // Tìm đơn hàng đang chờ của người dùng và người bán (Truy vấn tối ưu)
            var targetOrder = await _ordersRepo.GetPendingOrderByUserIdAndSellerIdAsync(appUser.Id, product.UserId);

            if (targetOrder == null)
            {
                // Tạo đơn hàng mới nếu không tìm thấy đơn hàng phù hợp
                targetOrder = new Orders { UserId = appUser.Id, OrderStatus = "Pending" };
                await _ordersRepo.CreateAsync(targetOrder);
            }

            // Kiểm tra chi tiết đơn hàng cho sản phẩm này trong đơn hàng
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
                newOrderDetail.OrderId = targetOrder.Id; // Gán OrderId rõ ràng
                await _ordersDetailsRepo.CreateAsync(newOrderDetail);
            }

            // Cập nhật số lượng sản phẩm (Đặt bên ngoài if/else để rõ ràng hơn)
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
            var quantity = updateOrderDetails.Quantity;
            var product = await _product.GetByIdAsync(updateOrderDetails.ProductId);
            if (product == null)
            {
                return NotFound();
            }
            var orderdetail = await _ordersDetailsRepo.GetByIdAsync(id);
            var quantityProduct = product.Quantity + orderdetail.Quantity;
            product.Quantity = quantityProduct;
            var unitPrice = product.Price * quantity;
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
            var orderdetailsModel = await _ordersDetailsRepo.UpdateAsync(id, updateOrderDetails.ToOrderFromUpdateDto(updateOrderDetails.ProductId, unitPrice));
            if (orderdetailsModel == null)
            {
                return NotFound();
            }
            return Ok(orderdetailsModel.ToOrderDetailsDto());
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