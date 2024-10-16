namespace backend.Dtos.Orders.Details
{
    public class OrderDetailsDto
    {
        public int Id { get; set; }
        public int OrdersId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}