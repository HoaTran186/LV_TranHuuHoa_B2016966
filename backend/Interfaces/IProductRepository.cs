using backend.Helpers;
using backend.Models;

namespace backend.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllProducts();
        Task<List<Product>> GetAllAsync(QueryProduct queryProduct);
        Task<Product?> GetByIdAsync(int id);
        Task<List<Product>> GetUserProduct(AppUser appUser);
        Task<Product> GetUserProductById(AppUser appUser, int id);
        Task<Product?> GetByProductNameAsync(string productname);
        Task<Product> CreateAsync(Product productModel);
        Task<Product?> UpdateAsync(int id, Product updateProductDto);
        Task<Product?> DeleteAsync(int id);
        Task<Product?> UpdateCensor(int id, Product updateCensorDto);
        Task<bool> ProductExists(int id);
    }
}