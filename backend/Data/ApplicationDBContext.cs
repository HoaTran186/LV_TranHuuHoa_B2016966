using backend.Dtos.Account;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions)
        :base(dbContextOptions)
        {
            
        }
        public DbSet<ProductType> ProductType {get; set;}
        public DbSet<Product> Products {get; set;}
        public DbSet<ProductImages> ProductImages {get; set;}
        public DbSet<Comments> Comments {get; set;}
        public DbSet<UserProduct> UserProducts {get; set;}
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserProduct>(x => x.HasKey(p => new {p.UserId, p.productId}));

            builder.Entity<UserProduct>()
            .HasOne(u => u.AppUser)
            .WithMany(u => u.UserProducts)
            .HasForeignKey(p => p.UserId);

            builder.Entity<UserProduct>()
            .HasOne(u => u.Product)
            .WithMany(u => u.UserProducts)
            .HasForeignKey(p => p.productId);

            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole
                {
                    Name = "User",
                    NormalizedName = "USER"
                },
                new IdentityRole
                {
                    Name = "Creator",
                    NormalizedName = "CREATOR"
                },
            };
            builder.Entity<IdentityRole>().HasData(roles);
        }
    }
}