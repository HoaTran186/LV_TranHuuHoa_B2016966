using backend.Models;

namespace backend.Interfaces
{
    public interface ICommentRepository
    {
        Task<List<Comments>> GetAllAsync ();
        Task<List<Comments?>> GetByProductIdAsync(int productId);
        Task<Comments> CreateAsync(Comments commentsModel);
        Task<Comments?> DeleteAsync(int id);
    }
}