namespace backend.Helpers
{
    public class QueryObject
    {
        public string? ProductType_Name {get; set;} = null;
        public string? SortBy { get; set; } = null;
        public bool IsDecsending { get; set; } = false;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}