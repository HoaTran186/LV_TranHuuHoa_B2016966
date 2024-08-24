using backend.Dtos.Product;
using backend.Models;

namespace backend.Mappers
{
    public static class ProductTypeMappers
    {
        public static ProductTypeDto ToProductDto(this ProductType productTypeModel)
        {
            return new ProductTypeDto
            {
                Id = productTypeModel.Id,
                ProductType_Name = productTypeModel.ProductType_Name,
                Products = productTypeModel.Products.Select(c => c.ToProductDto()).ToList()
            };
        }
        public static ProductType ToProductTypeFromCreateDto(this CreateProductTypeRequestDto productTypeDto)
        {
            return new ProductType
            {
                ProductType_Name = productTypeDto.ProductType_Name
            };
        }
    }
}