using backend.Models;

namespace backend.Interfaces
{
    public interface IForumImagesRepository
    {
        Task<List<ForumImages>> GetAllAsync();
        Task<ForumImages?> GetByIdAsync(int id);
        Task<List<ForumImages>> GetByForumId(int forumId);
        Task<ForumImages> CreateAsync(ForumImages ForumImagesModel);
        Task<ForumImages?> DeleteAsync(int id);
    }
}