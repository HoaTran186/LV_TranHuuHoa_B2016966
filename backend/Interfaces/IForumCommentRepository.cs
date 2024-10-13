using backend.Helpers;
using backend.Models;

namespace backend.Interfaces
{
    public interface IForumCommentRepository
    {
        Task<List<CommentForum>> GetAllAsync(QueryCommentForum queryComment);
        Task<CommentForum?> GetByIdAsync(int id);
        Task<List<CommentForum?>> GetByForumIdAsync(int forumtId, QueryCommentForum queryComment);
        Task<List<CommentForum?>> GetByForumId(int forumtId);
        Task<CommentForum> CreateAsync(CommentForum commentsModel);
        Task<CommentForum?> UpdateAsync(int id, CommentForum updateCommentDto);
        Task<CommentForum?> DeleteAsync(int id);
        Task<IEnumerable<CommentForum>?> DeleteByForumId(int forumId);
        Task DeleteAllAsync();
    }
}