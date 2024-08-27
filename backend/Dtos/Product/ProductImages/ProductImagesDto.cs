namespace backend.Dtos.Product.ProductImages
{
    public class ProductImagesDto
    {
        public int Id {get; set;}
        public string ImagesName { get; set; } = string.Empty;
        public int? ProductId { get; set; }
    }
}