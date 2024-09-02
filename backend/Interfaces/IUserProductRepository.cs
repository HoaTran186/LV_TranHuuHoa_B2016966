using backend.Models;

namespace backend.Interfaces
{
    public interface IUserProductRepository
    {
        Task<List<Product>> GetUserProduct(AppUser user);
    }
}