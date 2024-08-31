namespace backend.Dtos.Comment
{
    public class CommentsDto
    {
        public int Id { get; set; }
        public string Comment { get; set; } = string.Empty;
        public int? productId { get; set; }
        public string? UserName {get; set;}
    }
}