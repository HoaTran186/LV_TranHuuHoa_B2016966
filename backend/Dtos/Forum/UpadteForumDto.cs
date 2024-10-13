using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Forum
{
    public class UpdateForumDto
    {
        [Required]
        [MinLength(2, ErrorMessage = "Title must be 3 characters")]
        public string Title { get; set; } = string.Empty;
        [Required]
        [MinLength(10, ErrorMessage = "Title must be 10 characters")]
        public string Content { get; set; } = string.Empty;
    }
}