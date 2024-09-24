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
                Quantity = productModel.Quantity,
                Price = productModel.Price,
                ProductTypeId = productModel.ProductTypeId,
                Censor = productModel.Censor,
                UserId = productModel.UserId,
                Comments = productModel.Comments.Select(c => c.ToCommentDto()).ToList(),
                ProductImages = productModel.ProductImages.Select(i => i.ToProductImagesDto()).ToList()
            };
        }
        public static Product ToProductFromCreateDto(this CreateProductRequestDto productDto, string UserId)
        {
            return new Product
            {
                Product_Name = productDto.Product_Name,
                Origin = productDto.Origin,
                Unique = productDto.Unique,
                Apply = productDto.Apply,
                Result = productDto.Result,
                Quantity = productDto.Quantity,
                Price = productDto.Price,
                ProductTypeId = productDto.ProductTypeId,
                UserId = UserId,
                Censor = false
            };
        }
        public static Product ToUserProductFromUpdateDto(this UpdateProductDto productDto, string UserId)
        {
            return new Product
            {
                Product_Name = productDto.Product_Name,
                Origin = productDto.Origin,
                Unique = productDto.Unique,
                Apply = productDto.Apply,
                Result = productDto.Result,
                Quantity = productDto.Quantity,
                Price = productDto.Price,
                ProductTypeId = productDto.ProductTypeId,
                UserId = UserId
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
                Quantity = productDto.Quantity,
                Price = productDto.Price,
                ProductTypeId = productDto.ProductTypeId,
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