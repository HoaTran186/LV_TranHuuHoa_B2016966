namespace backend.Dtos.Orders
{
    public class UpdateOrderDto
    {
        public string OrderStatus { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? ShippedDate { get; set; }
        public decimal TotalAmount { get; set; }
    }
}