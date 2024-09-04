using backend.Models;

namespace backend.Interfaces
{
    public interface ICommentRepository
    {
        Task<List<Comments>> GetAllAsync ();
        Task<Comments?> GetByIdAsync(int id);
        Task<List<Comments?>> GetByProductIdAsync(int productId);
        Task<Comments> CreateAsync(Comments commentsModel);
        Task<Comments?> UpdateAsync(int id, Comments updateCommentDto);
        Task<Comments?> DeleteAsync(int id);
    }
}