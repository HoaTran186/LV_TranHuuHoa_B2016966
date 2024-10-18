using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MimeKit.Encodings;

namespace backend.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions)
        : base(dbContextOptions)
        {

        }
        public DbSet<ProductType> ProductType { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImages> ProductImages { get; set; }
        public DbSet<Comments> Comments { get; set; }
        public DbSet<UserProduct> UserProducts { get; set; }
        public DbSet<UserInformation> UserInformation { get; set; }
        public DbSet<Messages> Messages { get; set; }
        public DbSet<Orders> Orders { get; set; }
        public DbSet<OrderDetails> OrderDetails { get; set; }
        public DbSet<Forum> Forums { get; set; }
        public DbSet<ForumImages> ForumImages { get; set; }
        public DbSet<CommentForum> CommentForums { get; set; }
        public DbSet<ActiveUser> ActiveUsers { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserProduct>(x => x.HasKey(p => new { p.UserId, p.productId }));
            builder.Entity<ActiveUser>()
            .HasKey(up => new { up.UserId, up.ProductId });

            builder.Entity<UserProduct>()
            .HasOne(u => u.AppUser)
            .WithMany(u => u.UserProducts)
            .HasForeignKey(p => p.UserId);

            builder.Entity<UserProduct>()
            .HasOne(u => u.Product)
            .WithMany(u => u.UserProducts)
            .HasForeignKey(p => p.productId);

            builder.Entity<OrderDetails>()
           .HasOne(od => od.Orders)
           .WithMany(o => o.OrderDetails)
           .HasForeignKey(od => od.OrdersId)
           .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<OrderDetails>()
                .HasOne(od => od.Product)
                .WithMany(p => p.OrderDetails)
                .HasForeignKey(od => od.ProductId)
                .OnDelete(DeleteBehavior.Restrict);


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