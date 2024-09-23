using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Messages")]
    public class Messages
    {
        public int Id { get; set; }
        public string Sender { get; set; }
        public string Receiver { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsDelivered { get; set; }
    }
}