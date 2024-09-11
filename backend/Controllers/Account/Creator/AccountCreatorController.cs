using backend.Container;
using backend.Dtos.Account;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Controllers.Account.Creator
{
    [Route("api/creator/account")]
    [ApiController]
    public class AccountCreatorController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IEmailSender _emailSender;
        public AccountCreatorController(IMemoryCache cache, UserManager<AppUser> userManager, ITokenService tokenService,
        SignInManager<AppUser> signInManager, IEmailSender emailSender)
        {
            _cache = cache;
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _emailSender = emailSender;
        }
        [HttpPost("register-creator")]
        public async Task<IActionResult> RegisterCreator([FromBody] RegisterDto registerDto)
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

                var otp = new Random().Next(100000, 999999).ToString();
                var cacheKey = $"OTP_{registerDto.Email}";
                _cache.Set(cacheKey, otp, TimeSpan.FromMinutes(5));

                var emailSubject = "Your OTP for Registration";
                var email = new EmailOTP();
                var emailBody = email.GenerateOtpEmailBody(otp);
                await _emailSender.SendEmailAsync(registerDto.Email, emailSubject, emailBody);

                var appUser = new AppUser
                {
                    UserName = registerDto.Username,
                    Email = registerDto.Email,
                };

                var createdCreator = await _userManager.CreateAsync(appUser, registerDto.Password);
                if (!createdCreator.Succeeded)
                {
                    return StatusCode(500, createdCreator.Errors);
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
        [HttpPost("verifyotp")]
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
                        var roleResult = await _userManager.AddToRoleAsync(appUser, "Creator");
                        if (appUser == null)
                        {
                            return BadRequest("User not found.");
                        }
                        if (roleResult.Succeeded)
                        {
                            return Ok(new NewCreatorDto
                            {
                                Username = appUser.UserName,
                                Email = appUser.Email,
                                Token = await _tokenService.CreateToken(appUser),
                                Roles = ["Creator"]
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
    }
}