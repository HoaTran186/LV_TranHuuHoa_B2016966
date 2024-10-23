using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly ApplicationDBContext _context;

        public MessageRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Messages>> GetMessagesBetweenUsers(string senderUserId, string receiverUserId)
        {
            return await _context.Messages
                .Where(m =>
                    (m.SenderId == senderUserId && m.ReceiveId == receiverUserId) ||
                    (m.SenderId == receiverUserId && m.ReceiveId == senderUserId))
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
        }

        public async Task AddMessage(Messages message)
        {
            await _context.Messages.AddAsync(message);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}