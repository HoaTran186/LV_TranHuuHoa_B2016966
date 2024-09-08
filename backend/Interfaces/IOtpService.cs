using backend.Models;

namespace backend.Interfaces
{
    public interface IOtpService
{
    Task SaveOtpAsync(AppUser user, string password, string otp);
    Task<(AppUser, string, string)> GetOtpInfoAsync(string email);
    Task RemoveOtpInfoAsync(string email);
}

}