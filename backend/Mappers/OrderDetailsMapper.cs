using backend.Dtos.Orders.Details;
using backend.Models;

namespace backend.Mappers
{
    public static class OrderDetailsMapper
    {
        public static OrderDetailsDto ToOrderDetailsDto(this OrderDetails orderDetailsModels)
        {
            return new OrderDetailsDto
            {
                Id = orderDetailsModels.Id,
                OrdersId = orderDetailsModels.OrdersId,
                ProductId = orderDetailsModels.ProductId,
                Quantity = orderDetailsModels.Quantity,
                UnitPrice = orderDetailsModels.UnitPrice
            };
        }
        public static OrderDetails ToOrderFromCreateDto(this CreateOrderDetailsDto orderDetailsDto, decimal unitPrice)
        {
            return new OrderDetails
            {
                OrdersId = orderDetailsDto.OrdersId,
                ProductId = orderDetailsDto.ProductId,
                Quantity = orderDetailsDto.Quantity,
                UnitPrice = unitPrice
            };
        }
        public static OrderDetails ToOrderFromUpdateDto(this UpdateOrderDetailsDto orderDetailsDto, int productId, decimal unitPrice)
        {
            return new OrderDetails
            {
                ProductId = productId,
                Quantity = orderDetailsDto.Quantity,
                UnitPrice = unitPrice
            };
        }
    }
}