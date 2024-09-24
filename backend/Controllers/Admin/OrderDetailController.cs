using backend.Dtos.Orders.Details;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Crypto.Modes;

namespace backend.Controllers.Admin
{
    [Route("api/user/orders-details")]
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

            var totalPrice = await _ordersDetailsRepo.GetTotalPriceByOrderIdAsync(createOrderDetails.OrderId);

            var order = await _ordersRepo.GetByIdAsync(createOrderDetails.OrderId);
            if (order == null)
            {
                return NotFound("Order not found.");
            }

            order.TotalAmount = totalPrice;

            await _ordersRepo.UpdateAsync(order.Id, order);

            return Ok(createOrderDetailsModel);
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
            var orderdetailsModel = await _ordersDetailsRepo.UpdateAsync(id, updateOrderDetails.ToOrderFromUpdateDto(unitPrice));
            if (orderdetailsModel == null)
            {
                return NotFound();
            }
            return Ok(orderdetailsModel.ToOrderDetailsDto());
        }
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var orderdetailsModel = await _ordersDetailsRepo.DeleteAsync(id);
            if (orderdetailsModel == null)
            {
                return NotFound();
            }
            return Ok("Deleted Order details");
        }
    }
}