namespace backend.Dtos.Product.ProductImages
{
    public class CreateProductImagesDto
    {
        public IFormFile? Images { get; set; }
        public int? ProductId { get; set; }
    }
}