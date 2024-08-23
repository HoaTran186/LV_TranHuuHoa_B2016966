using backend.Dtos.Product;
using backend.Models;

namespace backend.Interfaces
{
    public interface IProductTypeRepository
    {
        Task<List<ProductType>> GetAllAsync();
        Task<ProductType?> GetByIdAsync(int id);
        Task<ProductType> CreateAsync(ProductType productTypeModel);
        Task<ProductType?> UpdateAsync(int id, UpdateProductTypeRequestDto productTypeDto);
        Task<ProductType?> DeleteAsync(int id);
    }
}