using backend.Models;
using StackExchange.Redis;

namespace backend.Interfaces
{
    public interface IOrdersDetailsRepository
    {
        Task<List<OrderDetails>> GetAllAsync();
        Task<OrderDetails?> GetByIdAsync(int id);
        Task<OrderDetails> CreateAsync(OrderDetails orderDetailsModel);
        Task<OrderDetails> UpdateAsync(int id, OrderDetails updateDto);
        Task<OrderDetails?> DeleteAsync(int id);
        Task<List<OrderDetails?>> DeleteOrdersAsync(int orderId);
        Task<List<OrderDetails>> GetByOrderIdAsync(int orderId);
        Task<OrderDetails> GetByProductIdAndOrderIdAsync(int productId, int orderId);
        Task<decimal> GetTotalPriceByOrderIdAsync(int orderId);
        Task<List<OrderDetails>> GetByProductId(List<int> productId);


    }
}