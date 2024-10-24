using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Messages")]
    public class Messages
    {
        public int Id { get; set; }
        public string SenderId { get; set; }
        public string ReceiveId { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
    }
}