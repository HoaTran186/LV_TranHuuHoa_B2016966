using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class CommentRepository : ICommentRepository
    {
        private readonly ApplicationDBContext _context;
        public CommentRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Comments> CreateAsync(Comments commentsModel)
        {
            await _context.Comments.AddAsync(commentsModel);
            await _context.SaveChangesAsync();

            return commentsModel;
        }

        public async Task<Comments?> DeleteAsync(int id)
        {
            var commentModel = await _context.Comments.FirstOrDefaultAsync(i => i.Id == id);
            if(commentModel == null)
            {
                return null;
            }
            _context.Comments.Remove(commentModel);
            await _context.SaveChangesAsync();

            return commentModel;
        }

        public async Task<List<Comments>> GetAllAsync()
        {
            return await _context.Comments.ToListAsync();
        }

        public async Task<Comments?> GetByIdAsync(int id)
        {
            return await _context.Comments.FindAsync(id);
        }
    }
}