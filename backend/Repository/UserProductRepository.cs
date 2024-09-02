using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class UserProductRepository : IUserProductRepository
    {
        private readonly ApplicationDBContext _context;
        public UserProductRepository(ApplicationDBContext conext)
        {
            _context = conext;
        }
        public async Task<List<Product>> GetUserProduct(AppUser user)
        {
            return await _context.UserProducts.Where(u => u.UserId == user.Id)
            .Select(product => new Product{
                Id = product.productId,
                Product_Name = product.Product.Product_Name,
                Origin = product.Product.Origin,
                Unique = product.Product.Unique,
                Apply = product.Product.Apply,
                Result = product.Product.Result,
                Price = product.Product.Price,
                ProductTypeId = product.Product.ProductTypeId
            }).ToListAsync();
        }
    }
}