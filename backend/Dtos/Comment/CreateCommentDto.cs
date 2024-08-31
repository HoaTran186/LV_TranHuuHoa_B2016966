namespace backend.Dtos.Comment
{
    public class CreateCommentDto
    {
        public string Comment { get; set; } = string.Empty;
        public string? UserName {get; set;}
    }
}