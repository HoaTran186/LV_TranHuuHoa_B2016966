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
    [Route("api/user/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrdersRepository _ordersRepo;
        private readonly UserManager<AppUser> _userManager;
        private readonly IOrdersDetailsRepository _ordersDetailsRepo;
        public OrdersController(IOrdersRepository ordersRepo, UserManager<AppUser> userManager, IOrdersDetailsRepository ordersDetailsRepo)
        {
            _ordersRepo = ordersRepo;
            _userManager = userManager;
            _ordersDetailsRepo = ordersDetailsRepo;
        }
        [HttpGet]
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
        [HttpPost]
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
        [HttpGet("user")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetOrderUser()
        {
            var username = User.GetUserName();
            var appUser = await _userManager.FindByNameAsync(username);
            var orderUser = await _ordersRepo.GetUserOrders(appUser);

            return Ok(orderUser);
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
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var orderModel = await _ordersRepo.DeleteAsync(id);
            if (orderModel == null)
            {
                return NotFound();
            }
            return Ok("Deleted Orders");
        }
    }
}