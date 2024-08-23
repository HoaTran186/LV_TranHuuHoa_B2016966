using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions)
        :base(dbContextOptions)
        {
            
        }
        public DbSet<ProductType> ProductType {get; set;}
        public DbSet<Product> Products {get; set;}
        public DbSet<ProductImages> ProductImages {get; set;}
    }
}