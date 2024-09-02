using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Products")]
    public class Product
    {
        public int Id { get; set; }
        public string Product_Name { get; set; } = string.Empty;
        public string Origin { get; set; } = string.Empty;
        public string Unique {get; set;} = string.Empty;
        public string Apply { get; set; } = string.Empty;
        public string Result { get; set; } = string.Empty;
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public int? ProductTypeId {get;set;}
        public bool Censor { get; set; }
        public ProductType? ProductType {get; set;}
        public List<ProductImages> productImages {get; set;} = new List<ProductImages>();
        public List<Comments> comments {get; set;} = new List<Comments>();
        public List<UserProduct> UserProducts {get; set;} = new List<UserProduct>();
    }
}