namespace backend.Models
{
    public class ProductType
    {
        public int Id {get; set;}
        public string ProductType_Name { get; set; } = string.Empty;
        public List<Product> Products {get; set;} = new List<Product>();
    }
}