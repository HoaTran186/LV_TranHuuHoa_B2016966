using backend.Helpers;
using backend.Models;

namespace backend.Interfaces
{
    public interface ICommentRepository
    {
        Task<List<Comments>> GetAllAsync(QueryComment queryComment);
        Task<Comments?> GetByIdAsync(int id);
        Task<List<Comments?>> GetByProductIdAsync(int productId, QueryComment queryComment);
        Task<Comments> CreateAsync(Comments commentsModel);
        Task<Comments?> UpdateAsync(int id, Comments updateCommentDto);
        Task<Comments?> DeleteAsync(int id);
        Task<IEnumerable<Comments>?> DeleteByProductId(int productId);
        Task DeleteAllAsync();
    }
}