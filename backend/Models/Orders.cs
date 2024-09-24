using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Orders")]
    public class Orders
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string OrderStatus { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? ShippedDate { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public AppUser AppUser { get; set; }
        public ICollection<OrderDetails> OrderDetails { get; set; }

    }
}