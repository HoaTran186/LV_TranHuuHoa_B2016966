using backend.Dtos.Orders.Details;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
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
        public OrderDetailController(IOrdersDetailsRepository ordersDetailsRepo, IOrdersRepository ordersRepo, IProductRepository product)
        {
            _ordersRepo = ordersRepo;
            _ordersDetailsRepo = ordersDetailsRepo;
            _product = product;
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
            var quantity = createOrderDetails.Quantity;
            var product = await _product.GetByIdAsync(createOrderDetails.ProductId);
            if (product == null)
            {
                return NotFound();
            }

            // Kiểm tra xem Order có tồn tại không
            var order = await _ordersRepo.GetByIdAsync(createOrderDetails.OrderId);

            if (order == null || string.IsNullOrEmpty(order.OrderStatus))
            {
                // Nếu không tồn tại, tạo một Order mới
                var newOrder = new Orders
                {
                    OrderStatus = "Pending"
                };

                // Tạo order mới
                var createdOrder = await _ordersRepo.CreateAsync(newOrder);

                // Gán OrderId cho chi tiết đơn hàng mới
                createOrderDetails.OrderId = createdOrder.Id;
            }

            // Kiểm tra xem OrderDetail cho sản phẩm này đã tồn tại trong Order chưa
            var existingOrderDetail = await _ordersDetailsRepo.GetByProductIdAndOrderIdAsync(createOrderDetails.ProductId, createOrderDetails.OrderId);

            if (existingOrderDetail != null)
            {
                // Nếu chi tiết đơn hàng đã tồn tại, cộng thêm số lượng
                existingOrderDetail.Quantity += createOrderDetails.Quantity;

                var newQuantityProduct = product.Quantity - createOrderDetails.Quantity;
                if (newQuantityProduct >= 0)
                {
                    product.Quantity = newQuantityProduct;
                    await _product.UpdateAsync(createOrderDetails.ProductId, product);
                }
                else
                {
                    return Ok("Product quantity is not enough");
                }

                existingOrderDetail.UnitPrice = product.Price * existingOrderDetail.Quantity;
                await _ordersDetailsRepo.UpdateAsync(existingOrderDetail.Id, existingOrderDetail);
            }
            else
            {
                // Nếu chưa tồn tại, tạo mới chi tiết đơn hàng
                var unitPrice = product.Price * quantity;
                var quantityProduct = product.Quantity - createOrderDetails.Quantity;

                if (quantityProduct >= 0)
                {
                    product.Quantity = quantityProduct;
                    await _product.UpdateAsync(createOrderDetails.ProductId, product);
                }
                else
                {
                    return Ok("Product quantity is not enough");
                }

                var createOrderDetailsModel = createOrderDetails.ToOrderFromCreateDto(unitPrice);
                await _ordersDetailsRepo.CreateAsync(createOrderDetailsModel);
            }

            // Cập nhật tổng giá trị của đơn hàng
            var totalPrice = await _ordersDetailsRepo.GetTotalPriceByOrderIdAsync(createOrderDetails.OrderId);
            var orderToUpdate = await _ordersRepo.GetByIdAsync(createOrderDetails.OrderId);
            if (orderToUpdate == null)
            {
                return NotFound("Order not found.");
            }

            orderToUpdate.TotalAmount = totalPrice;
            await _ordersRepo.UpdateAsync(orderToUpdate.Id, orderToUpdate);

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