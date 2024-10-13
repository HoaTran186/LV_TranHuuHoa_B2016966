using backend.Dtos.Forum.ForumComment;
using backend.Dtos.Forum.ForumImages;
using backend.Models;

namespace backend.Dtos.Forum
{
    public class ForumDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; }
        public float Rating { get; set; }
        public bool Browse { get; set; }
        public string UserId { get; set; }

        public List<CommentForumDto> CommentForums = new List<CommentForumDto>();
        public List<ForumImagesDto> ForumImages = new List<ForumImagesDto>();
    }
}