namespace backend.Dtos.Comment
{
    public class CreateCommentDto
    {
        public string Title {get; set;} = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public int Star {get; set;}
        public string? UserName {get; set;}
    }
}