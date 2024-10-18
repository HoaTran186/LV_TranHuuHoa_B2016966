using backend.Models;
namespace backend.Models
{
    public class ActiveUser
    {
        public string UserId { get; set; }
        public int ProductId { get; set; }
        public bool HasViewed { get; set; }  // Người dùng đã xem sản phẩm
        public bool HasPurchased { get; set; }  // Người dùng đã mua sản phẩm

        // Quan hệ với bảng Product và AppUser
        public Product Product { get; set; }
        public AppUser AppUser { get; set; }
    }
}

