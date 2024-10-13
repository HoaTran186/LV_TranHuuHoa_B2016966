using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Forum")]
    public class Forum
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; }
        public float Rating { get; set; }
        public bool Browse { get; set; }
        public string UserId { get; set; }
        public AppUser AppUser { get; set; }

        public List<CommentForum> CommentForums { get; set; } = new List<CommentForum>();
        public List<ForumImages> ForumImages { get; set; } = new List<ForumImages>();
    }
}