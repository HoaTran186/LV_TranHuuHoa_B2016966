using backend.Models;

namespace backend.Interfaces
{
    public interface IProductImagesRepository
    {
        Task<List<ProductImages>> GetAllAsync();
        Task<ProductImages?> GetByIdAsync(int id);
        Task<ProductImages> CreateAsync(ProductImages productImagesModel);
        Task<ProductImages?> UpdateAsync(int id, ProductImages updateProductImagesDto);
        Task<ProductImages?> DeleteAsync(int id);
    }
}