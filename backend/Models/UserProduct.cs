using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("User Product")]
    public class UserProduct
    {
        public string UserId { get; set; }
        public int productId { get; set; }
        public AppUser AppUser { get; set; }
        public Product Product { get; set; }
    }
}