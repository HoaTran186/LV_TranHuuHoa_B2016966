using backend.Data;
using backend.Dtos.Product;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDBContext _context;
        public ProductRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<Product> CreateAsync(Product productModel)
        {
            await _context.Products.AddAsync(productModel);
            await _context.SaveChangesAsync();

            return productModel;
        }

        public async Task<Product?> DeleteAsync(int id)
        {
            var productModel = await _context.Products.FirstOrDefaultAsync(x => x.Id == id);
            if(productModel == null)
            {
                return null;
            }
            _context.Products.Remove(productModel);
            await _context.SaveChangesAsync();
            return productModel;
        }

        public async Task<List<Product>> GetAllAsync()
        {
            return await _context.Products
                .Include(c =>c.productImages)
                .Include(c => c.comments)
                .ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products.Include(c => c.productImages).FirstOrDefaultAsync(s => s.Id == id);
        }

        public Task<bool> ProductExists(int id)
        {
            return _context.Products.AnyAsync(s => s.Id == id);
        }

        public async Task<Product?> UpdateAsync(int id, Product productDto)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if(existingProduct == null)
            {
                return null;
            }
            existingProduct.Product_Name = productDto.Product_Name;
            existingProduct.Origin = productDto.Origin;
            existingProduct.Unique = productDto.Unique;
            existingProduct.Apply = productDto.Apply;
            existingProduct.Result = productDto.Result;
            existingProduct.Price = productDto.Price;
            existingProduct.ProductTypeId = productDto.ProductTypeId;
            existingProduct.Censor = productDto.Censor;

            await _context.SaveChangesAsync();

            return existingProduct;
        }

        public async Task<Product?> UpdateCensor(int id, Product updateCensorDto)
        {
            var existingCensor = await _context.Products.FindAsync(id);
            if(existingCensor == null)
            {
                return null;
            }
            existingCensor.Censor = updateCensorDto.Censor;
            await _context.SaveChangesAsync();

            return existingCensor;
        }
    }
}