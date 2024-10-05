using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class OrdersDetailRepository : IOrdersDetailsRepository
    {
        private readonly ApplicationDBContext _context;
        public OrdersDetailRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<OrderDetails> CreateAsync(OrderDetails orderDetailsModel)
        {
            await _context.OrderDetails.AddAsync(orderDetailsModel);
            await _context.SaveChangesAsync();

            return orderDetailsModel;
        }

        public async Task<OrderDetails?> DeleteAsync(int id)
        {
            var orderDetailsModel = await _context.OrderDetails.FirstOrDefaultAsync(i => i.Id == id);
            if (orderDetailsModel == null)
            {
                return null;
            }
            _context.OrderDetails.Remove(orderDetailsModel);
            await _context.SaveChangesAsync();
            return orderDetailsModel;
        }

        public async Task<List<OrderDetails?>> DeleteOrdersAsync(int orderId)
        {
            var orderDetails = await _context.OrderDetails.Where(i => i.OrderId == orderId).ToListAsync();

            if (!orderDetails.Any())
            {
                return null;
            }

            _context.OrderDetails.RemoveRange(orderDetails);
            await _context.SaveChangesAsync();

            return orderDetails;
        }

        public async Task<List<OrderDetails>> GetAllAsync()
        {
            return await _context.OrderDetails.ToListAsync();
        }

        public async Task<OrderDetails?> GetByIdAsync(int id)
        {
            return await _context.OrderDetails.FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<List<OrderDetails>> GetByOrderIdAsync(int orderId)
        {
            return await _context.OrderDetails.Where(o => o.OrderId == orderId)
            .Select(orderdetails => new OrderDetails
            {
                Id = orderdetails.Id,
                ProductId = orderdetails.ProductId,
                Quantity = orderdetails.Quantity,
                UnitPrice = orderdetails.UnitPrice
            }).ToListAsync();
        }

        public async Task<OrderDetails> GetByProductIdAndOrderIdAsync(int productId, int orderId)
        {
            return await _context.OrderDetails
                .FirstOrDefaultAsync(od => od.ProductId == productId && od.OrderId == orderId);
        }


        public async Task<decimal> GetTotalPriceByOrderIdAsync(int orderId)
        {
            return await _context.OrderDetails
                .Where(o => o.OrderId == orderId)
                .SumAsync(o => o.UnitPrice);
        }

        public async Task<OrderDetails> UpdateAsync(int id, OrderDetails updateDto)
        {
            var existingOrderDetail = await _context.OrderDetails.FindAsync(id);
            if (existingOrderDetail == null)
            {
                return null;
            }
            existingOrderDetail.ProductId = updateDto.ProductId;
            existingOrderDetail.Quantity = updateDto.Quantity;
            existingOrderDetail.UnitPrice = updateDto.UnitPrice;
            await _context.SaveChangesAsync();

            return existingOrderDetail;
        }


    }
}