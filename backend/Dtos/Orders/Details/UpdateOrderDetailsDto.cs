namespace backend.Dtos.Orders.Details
{
    public class UpdateOrderDetailsDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}