namespace backend.Helpers
{
    public class QueryProduct
    {
        public string? Product_Name { get; set; } = null;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}