namespace backend.Dtos.Forum.ForumComment
{
    public class CreateCommentForumDto
    {
        public int Star { get; set; }
        public string Comment { get; set; } = string.Empty;
    }
}