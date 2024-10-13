namespace backend.Helpers
{
    public class QueryForum
    {
        public string? Title { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}