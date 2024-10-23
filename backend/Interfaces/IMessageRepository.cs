using backend.Models;

namespace backend.Interfaces
{
    public interface IMessageRepository
    {
        Task<IEnumerable<Messages>> GetMessagesBetweenUsers(string senderUserId, string receiverUserId);
        Task AddMessage(Messages message);
        Task SaveChangesAsync();
    }
}