using backend.Data;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class ForumCommentRepository : IForumCommentRepository
    {
        private readonly ApplicationDBContext _context;
        public ForumCommentRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<CommentForum> CreateAsync(CommentForum commentsModel)
        {
            await _context.CommentForums.AddAsync(commentsModel);
            await _context.SaveChangesAsync();

            return commentsModel;
        }

        public async Task DeleteAllAsync()
        {
            var comments = _context.CommentForums;
            _context.CommentForums.RemoveRange(comments);
            await _context.SaveChangesAsync();
        }

        public async Task<CommentForum?> DeleteAsync(int id)
        {
            var commentModel = await _context.CommentForums.FirstOrDefaultAsync(i => i.Id == id);
            if (commentModel == null)
            {
                return null;
            }
            _context.CommentForums.Remove(commentModel);
            await _context.SaveChangesAsync();

            return commentModel;
        }

        public async Task<IEnumerable<CommentForum>?> DeleteByForumId(int forumId)
        {
            var commentModel = await _context.CommentForums.Where(i => i.ForumId == forumId).ToListAsync();
            if (commentModel == null)
            {
                return null;
            }
            _context.CommentForums.RemoveRange(commentModel);
            await _context.SaveChangesAsync();
            return commentModel;
        }

        public async Task<List<CommentForum>> GetAllAsync(QueryCommentForum queryComment)
        {
            var comment = _context.CommentForums.AsQueryable();
            if (!string.IsNullOrWhiteSpace(queryComment.Comment))
            {
                comment = comment.Where(s => s.Comment.Contains(queryComment.Comment));
            }
            var skipNumber = (queryComment.PageNumber - 1) * queryComment.PageSize;
            return await comment.Skip(skipNumber).Take(queryComment.PageSize).ToListAsync();
        }

        public Task<List<CommentForum?>> GetByForumId(int forumtId)
        {
            return _context.CommentForums.Where(i => i.ForumId == forumtId).ToListAsync();
        }

        public async Task<List<CommentForum?>> GetByForumIdAsync(int forumtId, QueryCommentForum queryComment)
        {
            var comment = _context.CommentForums
            .Where(comment => comment.ForumId == forumtId)
            .AsQueryable();
            if (!string.IsNullOrWhiteSpace(queryComment.Comment))
            {
                comment = comment.Where(s => s.Comment.Contains(queryComment.Comment));
            }
            comment = comment.OrderByDescending(c => c.DateComment);
            var skipNumber = (queryComment.PageNumber - 1) * queryComment.PageSize;
            return await comment.Skip(skipNumber).Take(queryComment.PageSize).ToListAsync();
        }

        public async Task<CommentForum?> GetByIdAsync(int id)
        {
            return await _context.CommentForums.FindAsync(id);
        }

        public async Task<CommentForum?> UpdateAsync(int id, CommentForum updateCommentDto)
        {
            var existingComment = await _context.CommentForums.FindAsync(id);
            if (existingComment == null)
            {
                return null;
            }
            existingComment.Comment = updateCommentDto.Comment;
            existingComment.Star = updateCommentDto.Star;

            await _context.SaveChangesAsync();

            return existingComment;
        }
    }
}