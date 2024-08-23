using backend.Data;
using backend.Dtos.Product;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class ProductTypeRepository : IProductTypeRepository
    {
        private readonly ApplicationDBContext _context;
       public ProductTypeRepository(ApplicationDBContext context)
       {
            _context = context;
       }

        public async Task<ProductType> CreateAsync(ProductType productTypeModel)
        {
            await _context.ProductType.AddAsync(productTypeModel);
            await _context.SaveChangesAsync();
            return productTypeModel;
        }

        public async Task<ProductType?> DeleteAsync(int id)
        {
            var productTypeModel = await _context.ProductType.FirstOrDefaultAsync(x =>x.Id == id);
            if(productTypeModel == null)
            {
                return null;
            }
            _context.ProductType.Remove(productTypeModel);
            await _context.SaveChangesAsync();

            return productTypeModel;
        }

        public Task<List<ProductType>> GetAllAsync()
        {
            return _context.ProductType.ToListAsync();
        }

        public async Task<ProductType?> GetByIdAsync(int id)
        {
            return await _context.ProductType.FindAsync(id);
        }

        public async Task<ProductType?> UpdateAsync(int id, UpdateProductTypeRequestDto productTypeDto)
        {
            var existingProductType = await _context.ProductType.FirstOrDefaultAsync(x => x.Id == id);
            if(existingProductType == null)
            {
                return null;
            }
            existingProductType.ProductType_Name = productTypeDto.ProductType_Name;
            await _context.SaveChangesAsync();

            return existingProductType; 
        }
    }
}