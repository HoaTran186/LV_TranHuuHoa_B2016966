namespace backend.Dtos.Forum.ForumComment
{
    public class UpdateCommentForumDto
    {
        public int Star { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime DateComment { get; set; }
    }
}