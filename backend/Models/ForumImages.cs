using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Forum Imgaes")]
    public class ForumImages
    {
        public int Id { get; set; }
        public string? Images { get; set; }
        public int ForumId { get; set; }
        public Forum? Forum { get; set; }
    }
}