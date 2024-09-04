namespace backend.Dtos.Comment
{
    public class UpdateCommentDto
    {
        public string Title {get; set;} = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public int Star {get; set;}
    }
}