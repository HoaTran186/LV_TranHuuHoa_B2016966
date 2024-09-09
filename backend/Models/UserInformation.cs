using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("User Information")]
    public class UserInformation
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Age { get; set; }
        public string Job { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string UserId { get; set; }
        public AppUser AppUser {get; set;}

    }
}