using backend.Data;
using backend.Dtos.Product;
using backend.Helpers;
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
            if (productModel == null)
            {
                return null;
            }
            _context.Products.Remove(productModel);
            await _context.SaveChangesAsync();
            return productModel;
        }

        public async Task<List<Product>> GetAllAsync(QueryProduct queryProduct)
        {
            var product = _context.Products
                .Include(c => c.ProductImages)
                .Include(c => c.Comments)
                .AsQueryable();
            if (!string.IsNullOrWhiteSpace(queryProduct.Product_Name))
            {
                product = product.Where(s => s.Product_Name.Contains(queryProduct.Product_Name));
            }
            var skipNumber = (queryProduct.PageNumber - 1) * queryProduct.PageSize;
            return await product.Skip(skipNumber).Take(queryProduct.PageSize).ToListAsync();
        }

        public async Task<List<Product>> GetAllProducts()
        {
            return await _context.Products
                            .ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                            .Include(c => c.ProductImages)
                            .Include(c => c.Comments)
                            .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Product?> GetByProductNameAsync(string productname)
        {
            return await _context.Products.FirstOrDefaultAsync(s => s.Product_Name == productname);
        }

        public async Task<List<Product>> GetUserProduct(AppUser appUser, QueryProduct queryProduct)
        {
            var product = _context.Products
            .Include(c => c.ProductImages)
            .Include(c => c.Comments)
            .Where(u => u.UserId == appUser.Id)
            .Select(products => new Product
            {
                Id = products.Id,
                Product_Name = products.Product_Name,
                Origin = products.Origin,
                Unique = products.Unique,
                Apply = products.Apply,
                Quantity = products.Quantity,
                Rating = products.Rating,
                Result = products.Result,
                Price = products.Price,
                Censor = products.Censor,
                ProductTypeId = products.ProductTypeId,
                ProductImages = products.ProductImages,
                Comments = products.Comments
            }).AsQueryable();
            if (!string.IsNullOrWhiteSpace(queryProduct.Product_Name))
            {
                product = product.Where(s => s.Product_Name.Contains(queryProduct.Product_Name));
            }
            var skipNumber = (queryProduct.PageNumber - 1) * queryProduct.PageSize;
            return await product.Skip(skipNumber).Take(queryProduct.PageSize).ToListAsync();
        }

        public async Task<Product> GetUserProductById(AppUser appUser, int id)
        {
            return await _context.Products
                                    .Include(c => c.ProductImages)
                                    .Include(c => c.Comments)
                                    .Where(p => p.UserId == appUser.Id && p.Id == id)
                                    .FirstOrDefaultAsync();
        }

        public Task<bool> ProductExists(int id)
        {
            return _context.Products.AnyAsync(s => s.Id == id);
        }

        public async Task<Product?> UpdateAsync(int id, Product productDto)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return null;
            }
            existingProduct.Product_Name = productDto.Product_Name;
            existingProduct.Origin = productDto.Origin;
            existingProduct.Unique = productDto.Unique;
            existingProduct.Apply = productDto.Apply;
            existingProduct.Result = productDto.Result;
            existingProduct.Quantity = productDto.Quantity;
            existingProduct.Rating = productDto.Rating;
            existingProduct.Price = productDto.Price;
            existingProduct.ProductTypeId = productDto.ProductTypeId;
            existingProduct.Censor = productDto.Censor;

            await _context.SaveChangesAsync();

            return existingProduct;
        }

        public async Task<Product?> UpdateCensor(int id, Product updateCensorDto)
        {
            var existingCensor = await _context.Products.FindAsync(id);
            if (existingCensor == null)
            {
                return null;
            }
            existingCensor.Censor = updateCensorDto.Censor;
            await _context.SaveChangesAsync();

            return existingCensor;
        }
    }
}