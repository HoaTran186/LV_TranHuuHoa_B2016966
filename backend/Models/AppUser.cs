using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class AppUser : IdentityUser
    {
        public List<UserProduct> UserProducts {get; set;} = new List<UserProduct>();
        public List<Product> Products {get; set;}  = new List<Product>();
    }
}