using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class ProductImagesRepository : IProductImagesRepository
    {
        private readonly ApplicationDBContext _context;
        public ProductImagesRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<ProductImages> CreateAsync(ProductImages productImagesModel)
        {
            await _context.ProductImages.AddAsync(productImagesModel);
            await _context.SaveChangesAsync();

            return productImagesModel;
        }

        public Task<ProductImages?> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<ProductImages>> GetAllAsync()
        {
            return await _context.ProductImages.ToListAsync();
        }

        public async Task<ProductImages?> GetByIdAsync(int id)
        {
            return await _context.ProductImages.FindAsync(id);
        }
        public Task<ProductImages?> UpdateAsync(int id, ProductImages updateProductImagesDto)
        {
            throw new NotImplementedException();
        }
    }
}