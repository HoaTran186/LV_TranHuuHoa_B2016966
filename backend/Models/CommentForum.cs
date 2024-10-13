using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Forum Comment")]
    public class CommentForum
    {
        public int Id { get; set; }
        public int Star { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime DateComment { get; set; }
        public int ForumId { get; set; }
        public string UserId { get; set; }
        public Forum? Forum { get; set; }
        public AppUser AppUser { get; set; }
    }
}