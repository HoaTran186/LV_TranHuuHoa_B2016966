using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Comment
{
    public class CommentsDto
    {
        public int Id { get; set; }
        public string Title {get; set;} = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public int Star {get; set;}
        public int? productId { get; set; }
        public string? UserId {get; set;}
    }
}