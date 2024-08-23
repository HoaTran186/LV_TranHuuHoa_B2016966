namespace backend.Dtos.Product
{
    public class UpdateProductDto
    {
        public string Product_Name { get; set; } = string.Empty;
        public string Origin { get; set; } = string.Empty;
        public string Unique {get; set;} = string.Empty;
        public string Apply { get; set; } = string.Empty;
        public string Result { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int? ProductTypeId {get;set;}
    }
}