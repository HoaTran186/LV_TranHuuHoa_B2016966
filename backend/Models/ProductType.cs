using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Product Types")]
    public class ProductType
    {
        public int Id {get; set;}
        public string ProductType_Name { get; set; } = string.Empty;
        public List<Product> Products {get; set;} = new List<Product>();
    }
}