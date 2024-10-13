using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class ForumImagesRepository : IForumImagesRepository
    {
        private readonly ApplicationDBContext _context;
        public ForumImagesRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<ForumImages> CreateAsync(ForumImages ForumImagesModel)
        {
            await _context.ForumImages.AddAsync(ForumImagesModel);
            await _context.SaveChangesAsync();

            return ForumImagesModel;
        }

        public async Task<ForumImages?> DeleteAsync(int id)
        {
            var forumImagesModel = await _context.ForumImages.FirstOrDefaultAsync(i => i.Id == id);
            if (forumImagesModel == null)
            {
                return null;
            }
            _context.ForumImages.Remove(forumImagesModel);
            await _context.SaveChangesAsync();
            return forumImagesModel;
        }

        public async Task<List<ForumImages>> GetAllAsync()
        {
            return await _context.ForumImages.ToListAsync();
        }

        public async Task<ForumImages?> GetByIdAsync(int id)
        {
            return await _context.ForumImages.FindAsync(id);
        }

        public async Task<List<ForumImages>> GetByForumId(int forumId)
        {
            return await _context.ForumImages
                    .Where(i => i.ForumId == forumId)
                    .ToListAsync();
        }
    }
}