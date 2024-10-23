using backend.Dtos.Product;
using backend.Helpers;
using backend.Models;

namespace backend.Interfaces
{
    public interface IProductTypeRepository
    {
        Task<List<ProductType>> GetAllAsync(QueryObject query);
        Task<List<ProductType>> GetAllProductType();
        Task<ProductType?> GetByIdAsync(int id);
        Task<ProductType> CreateAsync(ProductType productTypeModel);
        Task<ProductType?> UpdateAsync(int id, UpdateProductTypeRequestDto productTypeDto);
        Task<ProductType?> DeleteAsync(int id);
        Task<bool> ProductTypeExists(int id);

    }
}