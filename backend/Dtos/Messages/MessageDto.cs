namespace backend.Dtos.Messages
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
    }
}