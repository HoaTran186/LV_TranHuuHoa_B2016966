using backend.Dtos.Orders;
using backend.Extensions;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Account.Users
{
    [Route("api/user/orders")]
    [ApiController]
    public class OrdersUserController : ControllerBase
    {
        private readonly IOrdersRepository _ordersRepo;
        private readonly UserManager<AppUser> _userManager;
        private readonly IOrdersDetailsRepository _ordersDetailsRepo;
        private readonly IProductRepository _product;
        public OrdersUserController(IOrdersRepository ordersRepo, UserManager<AppUser> userManager, IOrdersDetailsRepository ordersDetailsRepo
        , IProductRepository product)
        {
            _ordersRepo = ordersRepo;
            _userManager = userManager;
            _ordersDetailsRepo = ordersDetailsRepo;
            _product = product;
        }
        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetAllOrdersUser()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var orders = await _ordersRepo.GetUserOrders(appUser);
            var ordersDto = orders.Select(s => s.ToOrdersDto());

            return Ok(ordersDto);

        }
        [HttpGet("{id:int}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var order = await _ordersRepo.GetByIdAsync(id);
            if (order.UserId != appUser.Id)
            {
                return NotFound();
            }
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order.ToOrdersDto());
        }
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto createOrderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var ordersModel = createOrderDto.ToOrdersFromCreatesDto(appUser.Id);

            await _ordersRepo.CreateAsync(ordersModel);

            return Ok(ordersModel);
        }
        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateOrderDto updateOrder)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var existingOrder = await _ordersRepo.GetByIdAsync(id);
            if (existingOrder == null)
            {
                return NotFound();
            }
            if (existingOrder.UserId != appUser.Id)
            {
                return BadRequest("You do not have permission to update this order.");
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
        [Authorize(Roles = "User")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var orders = await _ordersRepo.GetByIdAsync(id);
            if (orders.UserId != appUser.Id)
            {
                return BadRequest("You do not have permission to update this order.");
            }
            var orderDetails = await _ordersDetailsRepo.GetByOrderIdAsync(id);
            if (orderDetails == null || !orderDetails.Any())
            {
                await _ordersRepo.DeleteAsync(id);
                return Ok("Deleted Orders");
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
            return Ok("Deleted Orders and Order details");
        }
        [HttpPut("receive/{orderId:int}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> ConfirmReceived([FromRoute] int orderId)
        {
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var order = await _ordersRepo.GetByIdAsync(orderId);

            if (order == null)
            {
                return NotFound(new { Message = "Order not found" });
            }

            if (order.UserId != appUser.Id)
            {
                return BadRequest("You do not have permission to confirm this order.");
            }

            if (order.OrderStatus != "Shipped")
            {
                return BadRequest(new { Message = "Order is not yet shipped or already delivered." });
            }

            order.OrderStatus = "Complete";
            await _ordersRepo.UpdateAsync(orderId, order);

            return Ok(new { Message = "Order marked as received." });
        }
        [HttpPut("pending/{orderId:int}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> ConfirmPending([FromRoute] int orderId)
        {
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var order = await _ordersRepo.GetByIdAsync(orderId);

            if (order == null)
            {
                return NotFound(new { Message = "Order not found" });
            }

            if (order.UserId != appUser.Id)
            {
                return BadRequest("You do not have permission to confirm this order.");
            }

            if (order.OrderStatus != "Buying")
            {
                return BadRequest(new { Message = "Order is not yet buying." });
            }

            order.OrderStatus = "Pending";
            await _ordersRepo.UpdateAsync(orderId, order);

            return Ok(new { Message = "Order marked as pending." });
        }
    }
}