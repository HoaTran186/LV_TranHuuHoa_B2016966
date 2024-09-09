using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class UserInformationRepository : IUserInformationRepository
    {
        private readonly ApplicationDBContext _context;
        public UserInformationRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<UserInformation> CreateAsync(UserInformation userInformation)
        {
            await _context.UserInformation.AddAsync(userInformation);
            await _context.SaveChangesAsync();

            return userInformation;
        }

        public async Task<UserInformation?> DeleteAsync(int id)
        {
            var userInfo = await _context.UserInformation.FirstOrDefaultAsync(u => u.Id == id);
            if (userInfo == null)
            {
                return null;
            }
            _context.UserInformation.Remove(userInfo);
            await _context.SaveChangesAsync();

            return userInfo;
        }

        public async Task<List<UserInformation>> GetAllAsync()
        {
            return await _context.UserInformation.ToListAsync();
        }

        public async Task<UserInformation?> GetByIdAsync(int id)
        {
            return await _context.UserInformation.FindAsync(id);
        }

        public async Task<UserInformation?> GetByUserIdAsync(AppUser appUser)
        {
            return await _context.UserInformation
                             .FirstOrDefaultAsync(u => u.UserId == appUser.Id);
        }

        public async Task<UserInformation?> UpddateAsync(int id, UserInformation updateUserInformation)
        {
            var existingUserInfo = await _context.UserInformation.FirstOrDefaultAsync(e => e.Id == id);
            if (existingUserInfo == null)
            {
                return null;
            }
            existingUserInfo.FullName = updateUserInformation.FullName;
            existingUserInfo.Age = updateUserInformation.Age;
            existingUserInfo.Job = updateUserInformation.Job;
            existingUserInfo.Address = updateUserInformation.Address;
            existingUserInfo.Phone = updateUserInformation.Phone;
            await _context.SaveChangesAsync();

            return existingUserInfo;
        }
    }
}