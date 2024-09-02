using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Product
{
    public class CreateProductRequestDto
    {
        [Required]
        [MinLength(3, ErrorMessage ="Product Name must be 3 characters")]
        [MaxLength(1024, ErrorMessage ="Product Name cannot be over 1024 characters")]
        public string Product_Name { get; set; } = string.Empty;
        [Required]
        [MinLength(5, ErrorMessage = "Origin must be 5 characters")]
        public string Origin { get; set; } = string.Empty;
        [Required]
        [MinLength(5, ErrorMessage = "Unique must be 5 characters")]
        public string Unique {get; set;} = string.Empty;
        [Required]
        [MinLength(5, ErrorMessage = "Apply must be 5 characters")]
        public string Apply { get; set; } = string.Empty;
        [Required]
        [MinLength(5, ErrorMessage = "Result must be 5 characters")]
        public string Result { get; set; } = string.Empty;
        [Required]
        public decimal Price { get; set; }
        [Required]
        public int? ProductTypeId {get;set;}
        public bool Censor { get; set; } = false;
    }
}