using backend.Helpers;
using backend.Models;

namespace backend.Interfaces
{
    public interface IForumRepository
    {
        Task<List<Forum>> GetAllAsync(QueryForum queryForum);
        Task<Forum?> GetByIdAsync(int id);
        Task<List<Forum>> GetUserForum(AppUser appUser, QueryForum queryForum);
        Task<Forum> GetByIdUserForum(AppUser appUser, int id);
        Task<Forum> CreateAsync(Forum forumModel);
        Task<Forum?> UpdateAsync(int id, Forum forumModel);
        Task<bool> ForumExists(int id);
        Task<Forum?> DeleteAsync(int id);
        Task<Forum?> UpdateBrowse(int id, Forum updateBrowseForum);
    }
}