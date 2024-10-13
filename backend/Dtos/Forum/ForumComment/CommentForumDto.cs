namespace backend.Dtos.Forum.ForumComment
{
    public class CommentForumDto
    {
        public int Id { get; set; }
        public int Star { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime DateComment { get; set; }
        public int ForumId { get; set; }
        public string UserId { get; set; }
    }
}