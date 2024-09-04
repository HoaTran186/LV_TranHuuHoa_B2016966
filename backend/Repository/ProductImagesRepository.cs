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

        public async Task<ProductImages?> DeleteAsync(int id)
        {
            var productImagesModel = await _context.ProductImages.FirstOrDefaultAsync(i => i.Id == id);
            if(productImagesModel == null)
            {
                return null;
            }
            _context.ProductImages.Remove(productImagesModel);
            await _context.SaveChangesAsync();
            return productImagesModel;
        }
        public async Task<List<ProductImages>> GetAllAsync()
        {
            return await _context.ProductImages.ToListAsync();
        }

        public async Task<ProductImages?> GetByIdAsync(int id)
        {
            return await _context.ProductImages.FindAsync(id);
        }

        public async Task<List<ProductImages>> GetByProductId(int productId)
        {
            return await _context.ProductImages
                    .Where(i => i.ProductId == productId)
                    .ToListAsync();
        }
    }
}