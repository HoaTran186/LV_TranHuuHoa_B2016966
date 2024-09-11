namespace backend.Dtos.UserInformation
{
    public class CreateUserInformationDto
    {
        public string FullName { get; set; }
        public int Age { get; set; }
        public string Job { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string UserId { get; set; }
    }
}