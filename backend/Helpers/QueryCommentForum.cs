namespace backend.Helpers
{
    public class QueryCommentForum
    {
        public string? Comment { get; set; } = null;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}