namespace backend.Models
{
    public class ProductImages
    {
        public int Id {get; set;}
        public string ImagesName { get; set; } = string.Empty;
        public int? ProductId { get; set; }
        public Product? Product { get; set; }
    }
}