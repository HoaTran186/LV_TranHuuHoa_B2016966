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
                OrderId = orderDetailsModels.OrderId,
                ProductId = orderDetailsModels.ProductId,
                Quantity = orderDetailsModels.Quantity,
                UnitPrice = orderDetailsModels.UnitPrice
            };
        }
        public static OrderDetails ToOrderFromCreateDto(this CreateOrderDetailsDto orderDetailsDto, decimal unitPrice)
        {
            return new OrderDetails
            {
                OrderId = orderDetailsDto.OrderId,
                ProductId = orderDetailsDto.ProductId,
                Quantity = orderDetailsDto.Quantity,
                UnitPrice = unitPrice
            };
        }
        public static OrderDetails ToOrderFromUpdateDto(this UpdateOrderDetailsDto orderDetailsDto, decimal unitPrice)
        {
            return new OrderDetails
            {
                ProductId = orderDetailsDto.ProductId,
                Quantity = orderDetailsDto.Quantity,
                UnitPrice = unitPrice
            };
        }
    }
}