using backend.Models;

namespace backend.Interfaces
{
    public interface IUserInformationRepository
    {
        Task<List<UserInformation>> GetAllAsync();
        Task<UserInformation?> GetByIdAsync(int id);
        Task<UserInformation?> GetByUserIdAsync(string userId);
        Task<UserInformation> CreateAsync(UserInformation userInformation);
        Task<UserInformation?> UpddateAsync(int id, UserInformation updateUserInformation);
        Task<UserInformation?> DeleteAsync(int id);
    }
}