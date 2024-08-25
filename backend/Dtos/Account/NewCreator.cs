namespace backend.Dtos.Account
{
    public class NewCreatorDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public IList<string> Roles { get; set; }
    }
}