using backend.Data;
using backend.Dtos.Product;
using backend.Helpers;
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
            var productTypeModel = await _context.ProductType.FirstOrDefaultAsync(x => x.Id == id);
            if (productTypeModel == null)
            {
                return null;
            }
            _context.ProductType.Remove(productTypeModel);
            await _context.SaveChangesAsync();

            return productTypeModel;
        }

        public async Task<List<ProductType>> GetAllAsync(QueryObject query)
        {
            var products = _context.ProductType.Include(c => c.Products).AsQueryable();
            if (!string.IsNullOrWhiteSpace(query.ProductType_Name))
            {
                products = products.Where(s => s.ProductType_Name.Contains(query.ProductType_Name));
            }
            if (!string.IsNullOrWhiteSpace(query.SortBy))
            {
                if (query.SortBy.Equals("Product Name", StringComparison.OrdinalIgnoreCase))
                {
                    products = query.IsDecsending ? products.OrderByDescending(s => s.ProductType_Name) : products.OrderBy(s => s.ProductType_Name);
                }
            }
            var skipNumber = (query.PageNumber - 1) * query.PageSize;


            return await products.Skip(skipNumber).Take(query.PageSize).ToListAsync();
        }

        public async Task<List<ProductType>> GetAllProductType()
        {
            return await _context.ProductType.ToListAsync();
        }

        public async Task<ProductType?> GetByIdAsync(int id)
        {
            return await _context.ProductType.Include(c => c.Products).FirstOrDefaultAsync(i => i.Id == id);
        }

        public Task<bool> ProductTypeExists(int id)
        {
            return _context.ProductType.AnyAsync(s => s.Id == id);
        }

        public async Task<ProductType?> UpdateAsync(int id, UpdateProductTypeRequestDto productTypeDto)
        {
            var existingProductType = await _context.ProductType.FirstOrDefaultAsync(x => x.Id == id);
            if (existingProductType == null)
            {
                return null;
            }
            existingProductType.ProductType_Name = productTypeDto.ProductType_Name;
            await _context.SaveChangesAsync();

            return existingProductType;
        }
    }
}