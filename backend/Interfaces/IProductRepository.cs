using backend.Models;

namespace backend.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> CreateAsync(Product productModel);
        Task<Product?> UpdateAsync(int id, Product updateProductDto);
        Task<Product?> DeleteAsync(int id);
        Task<Product?> UpdateCensor(int id, Product updateCensorDto);
        Task<bool> ProductExists(int id);
    }
}