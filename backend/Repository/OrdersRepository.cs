using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class OrdersRepository : IOrdersRepository
    {
        private readonly ApplicationDBContext _context;
        public OrdersRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<Orders> CreateAsync(Orders ordersModel)
        {
            await _context.Orders.AddAsync(ordersModel);
            await _context.SaveChangesAsync();

            return ordersModel;
        }

        public async Task<Orders?> DeleteAsync(int id)
        {
            var orderModel = await _context.Orders.FirstOrDefaultAsync(i => i.Id == id);
            if (orderModel == null)
            {
                return null;
            }
            _context.Orders.Remove(orderModel);
            await _context.SaveChangesAsync();

            return orderModel;
        }

        public async Task<List<Orders>> GetAllAsync()
        {
            return await _context.Orders
                .Include(c => c.OrderDetails)
                .ToListAsync();
        }

        public async Task<Orders?> GetByIdAsync(int id)
        {
            return await _context.Orders.Include(c => c.OrderDetails).FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<Orders>> GetUserOrders(AppUser appUser)
        {
            return await _context.Orders.Where(u => u.UserId == appUser.Id)
            .Select(orders => new Orders
            {
                Id = orders.Id,
                UserId = orders.UserId,
                OrderStatus = orders.OrderStatus,
                OrderDate = orders.OrderDate,
                ShippedDate = orders.ShippedDate,
                TotalAmount = orders.TotalAmount
            }).ToListAsync();
        }

        public async Task<Orders> UpdateAsync(int id, Orders updateDto)
        {
            var existingOrder = await _context.Orders.FindAsync(id);
            if (existingOrder == null)
            {
                return null;
            }
            existingOrder.OrderStatus = updateDto.OrderStatus;
            existingOrder.OrderDate = updateDto.OrderDate;
            existingOrder.ShippedDate = updateDto.ShippedDate;
            existingOrder.TotalAmount = updateDto.TotalAmount;

            await _context.SaveChangesAsync();

            return existingOrder;
        }
    }
}