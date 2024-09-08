using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Account
{
    public class VerifyOtpDto
    {
        [EmailAddress]
        public string Email { get; set; }
        public string Otp { get; set; }
    }
}