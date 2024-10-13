using backend.Dtos.Orders;
using backend.Models;

namespace backend.Interfaces
{
    public interface IOrdersRepository
    {
        Task<List<Orders>> GetAllAsync();
        Task<Orders?> GetByIdAsync(int id);
        Task<List<Orders>> GetUserOrders(AppUser appUser);
        Task<Orders> CreateAsync(Orders ordersModel);
        Task<Orders?> DeleteAsync(int id);
        Task<Orders> UpdateAsync(int id, Orders updateDto);
        Task<List<Orders>> GetOrdersByIds(List<int> orderIds);
        Task<List<Orders>> GetPendingOrdersByUserIdAsync(string userId);
        Task<Orders> GetPendingOrderByUserIdAndSellerIdAsync(string userId, string sellerId);
    }
}