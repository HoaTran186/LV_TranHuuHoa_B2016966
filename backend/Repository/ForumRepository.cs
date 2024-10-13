using backend.Data;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class ForumRepository : IForumRepository
    {
        private readonly ApplicationDBContext _context;
        public ForumRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Forum> CreateAsync(Forum forumModel)
        {
            await _context.Forums.AddAsync(forumModel);
            await _context.SaveChangesAsync();

            return forumModel;
        }

        public async Task<Forum?> DeleteAsync(int id)
        {
            var forumModel = await _context.Forums.FirstOrDefaultAsync(f => f.Id == id);
            if (forumModel == null)
            {
                return null;
            }
            _context.Forums.Remove(forumModel);
            await _context.SaveChangesAsync();
            return forumModel;
        }

        public async Task<bool> ForumExists(int id)
        {
            return await _context.Forums.AnyAsync(s => s.Id == id);
        }

        public async Task<List<Forum>> GetAllAsync(QueryForum queryForum)
        {
            var forum = _context.Forums
                            .Include(c => c.ForumImages)
                            .AsQueryable();
            if (!string.IsNullOrWhiteSpace(queryForum.Title))
            {
                forum = forum.Where(s => s.Title.Contains(queryForum.Title));
            }
            var skipNumber = (queryForum.PageNumber - 1) * queryForum.PageSize;
            return await forum.Skip(skipNumber).Take(queryForum.PageSize).ToListAsync();
        }

        public Task<Forum?> GetByIdAsync(int id)
        {
            return _context.Forums
                            .Include(c => c.ForumImages)
                            .Include(c => c.CommentForums)
                            .FirstOrDefaultAsync(i => i.Id == id);
        }

        public Task<Forum> GetByIdUserForum(AppUser appUser, int id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Forum>> GetUserForum(AppUser appUser, QueryForum queryForum)
        {
            var forum = _context.Forums
                                .Include(c => c.ForumImages)
                                .Include(c => c.CommentForums)
                                .Where(u => u.UserId == appUser.Id)
                                .Select(forum => new Forum
                                {
                                    Id = forum.Id,
                                    Title = forum.Title,
                                    Content = forum.Content,
                                    UploadDate = forum.UploadDate,
                                    Rating = forum.Rating,
                                    Browse = forum.Browse,
                                    UserId = forum.UserId,
                                    CommentForums = forum.CommentForums,
                                    ForumImages = forum.ForumImages
                                }).AsQueryable();
            if (!string.IsNullOrWhiteSpace(queryForum.Title))
            {
                forum = forum.Where(s => s.Title.Contains(queryForum.Title));
            }
            var skipNumber = (queryForum.PageNumber - 1) * queryForum.PageSize;
            return await forum.Skip(skipNumber).Take(queryForum.PageSize).ToListAsync();
        }

        public async Task<Forum?> UpdateAsync(int id, Forum forumModel)
        {
            var existingForum = await _context.Forums.FindAsync(id);
            if (existingForum == null)
            {
                return null;
            }
            existingForum.Title = forumModel.Title;
            existingForum.Content = forumModel.Content;
            existingForum.UploadDate = forumModel.UploadDate;
            await _context.SaveChangesAsync();

            return existingForum;
        }
    }
}