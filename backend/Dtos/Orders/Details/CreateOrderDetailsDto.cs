namespace backend.Dtos.Orders.Details
{
    public class CreateOrderDetailsDto
    {
        public int OrdersId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}