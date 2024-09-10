using backend.Container;
using backend.Dtos.Account;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Controllers.Account.Users
{
    [Route("api/users/account")]
    [ApiController]
    public class AccountUserController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IEmailSender _emailSender;
        public AccountUserController(IMemoryCache cache, UserManager<AppUser> userManager, ITokenService tokenService,
        SignInManager<AppUser> signInManager, IEmailSender emailSender)
        {
            _cache = cache;
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _emailSender = emailSender;
        }
        [HttpPost("register-user")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
                if (existingUser != null)
                {
                    return BadRequest("Email already in use.");
                }
                var email = new EmailOTP();
                var otp = new Random().Next(100000, 999999).ToString();
                var cacheKey = $"OTP_{registerDto.Email}";
                _cache.Set(cacheKey, otp, TimeSpan.FromMinutes(5));

                var emailSubject = "Your OTP for Registration";
                var emailBody = email.GenerateOtpEmailBody(otp);
                await _emailSender.SendEmailAsync(registerDto.Email, emailSubject, emailBody);

                var appUser = new AppUser
                {
                    UserName = registerDto.Username,
                    Email = registerDto.Email,
                };

                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);
                if (!createdUser.Succeeded)
                {
                    return StatusCode(500, createdUser.Errors);
                }

                return Ok(new
                {
                    message = "OTP sent to email. Please verify the OTP to complete registration."
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, $"An error occurred: {e.Message}");
            }
        }
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto verifyOtpDto)
        {
            try
            {
                var cacheKey = $"OTP_{verifyOtpDto.Email}";
                if (_cache.TryGetValue(cacheKey, out string otpInCache))
                {
                    if (otpInCache == verifyOtpDto.Otp)
                    {
                        var appUser = await _userManager.FindByEmailAsync(verifyOtpDto.Email);
                        var roleResult = await _userManager.AddToRoleAsync(appUser, "User");
                        if (appUser == null)
                        {
                            return BadRequest("User not found.");
                        }
                        if (roleResult.Succeeded)
                        {
                            return Ok(new NewUserDto
                            {
                                Username = appUser.UserName,
                                Email = appUser.Email,
                                Token = await _tokenService.CreateToken(appUser),
                                Roles = ["User"]
                            });
                        }
                        else
                        {
                            return StatusCode(500, roleResult.Errors);
                        }

                    }
                    else
                    {
                        return BadRequest("Invalid OTP.");
                    }
                }
                else
                {
                    return BadRequest("OTP expired or not found.");
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, $"An error occurred: {e.Message}");
            }
        }
        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOtp(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }
            var newOtp = new Random().Next(100000, 999999).ToString();
            var emailRs = new EmailOTP();
            var cacheKey = $"OTP_{email}";
            _cache.Set(cacheKey, newOtp, TimeSpan.FromMinutes(5));
            var emailSubject = "Your OTP for Registration";
            var emailBody = emailRs.GenerateOtpEmailBody(newOtp);
            await _emailSender.SendEmailAsync(email, emailSubject, emailBody);

            return Ok("A new OTP has been sent to your email.");
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
                if (user == null)
                {
                    return BadRequest("User not found.");
                }

                var otp = new Random().Next(100000, 999999).ToString();
                var cacheKey = $"OTP_{forgotPasswordDto.Email}";
                _cache.Set(cacheKey, otp, TimeSpan.FromMinutes(5));

                var emailSubject = "Your OTP for Password Reset";
                var emailBody = new EmailOTP().GenerateOtpEmailBody(otp);
                await _emailSender.SendEmailAsync(forgotPasswordDto.Email, emailSubject, emailBody);

                return Ok("OTP for password reset has been sent to your email.");
            }
            catch (Exception e)
            {
                return StatusCode(500, $"An error occurred: {e.Message}");
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Xác thực OTP trong cache
                var cacheKey = $"OTP_{resetPasswordDto.Email}";
                if (_cache.TryGetValue(cacheKey, out string otpInCache))
                {
                    if (otpInCache == resetPasswordDto.Otp)
                    {
                        var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
                        if (user == null)
                        {
                            return BadRequest("User not found.");
                        }

                        // Đặt lại mật khẩu mà không cần token
                        var resetPasswordResult = await _userManager.RemovePasswordAsync(user);
                        if (!resetPasswordResult.Succeeded)
                        {
                            return StatusCode(500, resetPasswordResult.Errors);
                        }

                        var addPasswordResult = await _userManager.AddPasswordAsync(user, resetPasswordDto.NewPassword);
                        if (!addPasswordResult.Succeeded)
                        {
                            return StatusCode(500, addPasswordResult.Errors);
                        }

                        return Ok("Password has been reset successfully.");
                    }
                    else
                    {
                        return BadRequest("Invalid OTP.");
                    }
                }
                else
                {
                    return BadRequest("OTP expired or not found.");
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, $"An error occurred: {e.Message}");
            }
        }

    }
}