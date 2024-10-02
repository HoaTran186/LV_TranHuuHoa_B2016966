using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Comments")]
    public class Comments
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public int Star { get; set; }
        public DateTime DateComment { get; set; }
        public int? productId { get; set; }
        public string UserId { get; set; }
        public Product? Product { get; set; }
        public AppUser AppUser { get; set; }
    }
}