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
                ProductTypeId = productModel.ProductTypeId,
                Censor = productModel.Censor
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
        public static Product ToProductFromUpdateDto(this UpdateProductDto productDto)
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
        public static Product ToProductFromUpdateCensorDto(this UpdateCensorDto productDto)
        {
            return new Product
            {
                Censor = productDto.Censor
                
            };
        }
    }
}