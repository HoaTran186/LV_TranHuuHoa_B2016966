using backend.Dtos.Orders;
using backend.Extensions;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Admin
{
    [Route("api/admin/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrdersRepository _ordersRepo;
        private readonly UserManager<AppUser> _userManager;
        private readonly IOrdersDetailsRepository _ordersDetailsRepo;
        private readonly IProductRepository _product;
        public OrdersController(IOrdersRepository ordersRepo, UserManager<AppUser> userManager, IOrdersDetailsRepository ordersDetailsRepo
        , IProductRepository product)
        {
            _ordersRepo = ordersRepo;
            _userManager = userManager;
            _ordersDetailsRepo = ordersDetailsRepo;
            _product = product;
        }
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var orders = await _ordersRepo.GetAllAsync();
            var ordersDto = orders.Select(s => s.ToOrdersDto());

            return Ok(ordersDto);

        }
        [HttpGet("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var order = await _ordersRepo.GetByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order.ToOrdersDto());
        }

        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateOrderDto updateOrder)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var existingOrder = await _ordersRepo.GetByIdAsync(id);
            if (existingOrder == null)
            {
                return NotFound();
            }
            var totalAmount = await _ordersDetailsRepo.GetTotalPriceByOrderIdAsync(id);
            updateOrder.TotalAmount = totalAmount;
            var orderModel = await _ordersRepo.UpdateAsync(id, updateOrder.ToUserOrdersFromUpdateDto());
            if (orderModel == null)
            {
                return NotFound();
            }

            return Ok(orderModel.ToOrdersDto());
        }
        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var orderDetails = await _ordersDetailsRepo.GetByOrderIdAsync(id);
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
            var orderModel = await _ordersRepo.DeleteAsync(id);
            await _ordersDetailsRepo.DeleteOrdersAsync(id);
            if (orderModel == null)
            {
                return NotFound();
            }
            return Ok("Deleted Orders");
        }
    }
}