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
                ImagesName = productImagesModel.ImagesName,
                ProductId = productImagesModel.ProductId
            };
        }
        public static ProductImages ToProductImagesFromCreate (this CreateProductImagesDto productImagesModel, int productId)
        {
            return new ProductImages
            {
                ImagesName = productImagesModel.ImagesName,
                ProductId = productId
            };
        }
    }
}