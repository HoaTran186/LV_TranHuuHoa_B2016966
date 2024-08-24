using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Product
{
    public class UpdateProductTypeRequestDto
    {
        [Required]
        [MinLength(3, ErrorMessage = "Product Type Name must be 3 characters")]
        public string ProductType_Name { get; set; } = string.Empty;
    }
}