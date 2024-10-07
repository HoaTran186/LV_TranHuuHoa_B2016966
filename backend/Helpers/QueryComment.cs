namespace backend.Helpers
{
    public class QueryComment
    {
        public string? Comment { get; set; } = null;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}