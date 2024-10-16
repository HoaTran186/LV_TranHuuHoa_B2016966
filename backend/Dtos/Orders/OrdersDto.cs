using System.ComponentModel.DataAnnotations.Schema;
using backend.Dtos.Orders.Details;
using backend.Models;

namespace backend.Dtos.Orders
{
    public class OrdersDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string OrderStatus { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? ShippedDate { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderDetailsDto> OrderDetail { get; set; } = new List<OrderDetailsDto>();
        public ICollection<OrderDetails> OrderDetails { get; set; }

    }
}