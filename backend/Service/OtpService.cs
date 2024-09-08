using System.Collections.Concurrent;
using backend.Interfaces;
using backend.Models;

namespace backend.Service
{
    public class OtpService : IOtpService
    {
        private readonly ConcurrentDictionary<string, (AppUser, string, string)> _otpStore = new();

        public Task SaveOtpAsync(AppUser user, string password, string otp)
        {
            _otpStore[user.Email.ToLower()] = (user, password, otp);
            Console.WriteLine("Current OTP store contents:");
            foreach (var entry in _otpStore)
            {
                Console.WriteLine($"Email: {entry.Key}, OTP: {entry.Value.Item3}");
            }
            return Task.CompletedTask;
        }

        public Task<(AppUser, string, string)> GetOtpInfoAsync(string email)
        {
            Console.WriteLine($"Trying to retrieve OTP for {email.ToLower()}");  // Log email được truy xuất

            if (_otpStore.TryGetValue(email.ToLower(), out var info))
            {
                Console.WriteLine($"Found OTP: {info.Item3}");
                return Task.FromResult(info);
            }

            Console.WriteLine($"No OTP found for {email.ToLower()}");
            return Task.FromResult<(AppUser, string, string)>((null, null, null));
        }


        public Task RemoveOtpInfoAsync(string email)
        {
            // _otpStore.Remove(email);
            return Task.CompletedTask;
        }
    }

}