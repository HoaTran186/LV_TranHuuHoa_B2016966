using backend.Dtos.Orders;
using backend.Models;
using StackExchange.Redis;

namespace backend.Mappers
{
    public static class OrdersMapper
    {
        public static OrdersDto ToOrdersDto(this Orders ordersModel)
        {
            return new OrdersDto
            {
                Id = ordersModel.Id,
                UserId = ordersModel.UserId,
                OrderStatus = ordersModel.OrderStatus,
                OrderDate = ordersModel.OrderDate,
                ShippedDate = ordersModel.ShippedDate,
                TotalAmount = ordersModel.TotalAmount
            };
        }
        public static Orders ToOrdersFromCreatesDto(this CreateOrderDto orderDto, string UserId)
        {
            return new Orders
            {
                UserId = UserId,
                OrderStatus = orderDto.OrderStatus,
                OrderDate = DateTime.Now,
                ShippedDate = null,
                TotalAmount = orderDto.TotalAmount
            };
        }
        public static Orders ToUserOrdersFromUpdateDto(this UpdateOrderDto updateOrder)
        {
            return new Orders
            {
                OrderStatus = updateOrder.OrderStatus,
                OrderDate = updateOrder.OrderDate,
                ShippedDate = updateOrder.ShippedDate,
                TotalAmount = updateOrder.TotalAmount
            };
        }
    }
}