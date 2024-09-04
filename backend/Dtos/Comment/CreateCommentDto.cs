using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Comment
{
    public class CreateCommentDto
    {
        [Required]
        public string Title {get; set;} = string.Empty;
        [Required]
        public string Comment { get; set; } = string.Empty;
        [Required]
        public int Star {get; set;}
        [Required]
        public string? UserName {get; set;}
    }
}