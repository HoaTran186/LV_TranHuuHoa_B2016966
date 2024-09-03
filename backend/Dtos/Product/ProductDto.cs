using backend.Dtos.Comment;
using backend.Dtos.Product.ProductImages;
using backend.Dtos.UserProduct;

namespace backend.Dtos.Product
{
    public class ProductDto
    {
       public int Id { get; set; }
        public string Product_Name { get; set; } = string.Empty;
        public string Origin { get; set; } = string.Empty;
        public string Unique {get; set;} = string.Empty;
        public string Apply { get; set; } = string.Empty;
        public string Result { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int? ProductTypeId {get;set;}
        public bool Censor { get; set; }
        public string UserId { get; set; }
        public List<ProductImagesDto> ProductImages {get; set;} = new List<ProductImagesDto>();
        public List<CommentsDto> Comments {get; set;} = new List<CommentsDto>();
        public List<UserProductDto> UserProducts {get; set;} = new List<UserProductDto>();
    }
}