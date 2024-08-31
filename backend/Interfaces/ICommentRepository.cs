using backend.Models;

namespace backend.Interfaces
{
    public interface ICommentRepository
    {
        Task<List<Comments>> GetAllAsync ();
        Task<Comments?> GetByIdAsync(int id);
        Task<Comments> CreateAsync(Comments commentsModel);
        Task<Comments?> DeleteAsync(int id);
    }
}