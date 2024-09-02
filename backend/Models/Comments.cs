using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Comments")]
    public class Comments
    {
        public int Id {get; set;}
        public string Comment { get; set; } = string.Empty;
        public int? productId { get; set; }
        public string? UserName {get; set;}
        public Product? Product {get; set;}
    }
}