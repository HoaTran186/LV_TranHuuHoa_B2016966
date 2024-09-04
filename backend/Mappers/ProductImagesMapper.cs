using backend.Dtos.Product.ProductImages;
using backend.Models;

namespace backend.Mappers
{
    public static class ProductImagesMapper
    {
        public static ProductImagesDto ToProductImagesDto (this ProductImages productImagesModel)
        {
            return new ProductImagesDto
            {
                Id = productImagesModel.Id,
                ImagesName = productImagesModel.Images,
                ProductId = productImagesModel.ProductId
            };
        }
        public static ProductImages ToProductImagesFromCreate (this CreateProductImagesDto productImagesModel, int productId)
        {
            return new ProductImages
            {
                Images = productImagesModel.Images.ToString(),
                ProductId = productId
            };
        }
    }
}