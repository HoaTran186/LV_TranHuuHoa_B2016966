using backend.Dtos.Product;
using backend.Models;

namespace backend.Mappers
{
    public static class ProductMapper
    {
        public static ProductDto ToProductDto(this Product productModel)
        {
            return new ProductDto
            {
                Id = productModel.Id,
                Product_Name = productModel.Product_Name,
                Origin = productModel.Origin,
                Unique = productModel.Unique,
                Apply = productModel.Apply,
                Result = productModel.Result,
                Price = productModel.Price,
                ProductTypeId = productModel.ProductTypeId
            };
        }
        public static Product ToProductFromCreateDto(this CreateProductRequestDto productDto)
        {
            return new Product
            {
                Product_Name = productDto.Product_Name,
                Origin = productDto.Origin,
                Unique = productDto.Unique,
                Apply = productDto.Apply,
                Result = productDto.Result,
                Price = productDto.Price,
                ProductTypeId = productDto.ProductTypeId
            };
        }
    }
}