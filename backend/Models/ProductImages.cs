
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Product Images")]
    public class ProductImages
    {
        public int Id {get; set;}
        public string ImagesName { get; set; } = string.Empty;
        public int? ProductId { get; set; }
        public Product? Product { get; set; }


    }
}