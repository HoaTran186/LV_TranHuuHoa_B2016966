using backend.Dtos.Account;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly IOtpService _otpService;
        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService,
        SignInManager<AppUser> signInManager, IEmailSender emailSender, IOtpService otpService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _otpService = otpService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());
            if (user == null)
            {
                return Unauthorized("Invalid Username!");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded) return Unauthorized("Username not found and/or password incorect!");
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(
                new NewUserDto
                {
                    Username = user.UserName,
                    Email = user.Email,
                    Token = await _tokenService.CreateToken(user),
                    Roles = roles

                }
            );
        }
        [HttpPost("registeruser")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var appUser = new AppUser
                {
                    UserName = registerDto.Username,
                    Email = registerDto.Email
                };
                var rng = new Random();
                var otpCode = rng.Next(100000, 999999).ToString();

                var emailSent = await _emailSender.SendEmailAsync(appUser.Email, "Xác nhận tài khoản",
                    $"Mã OTP của bạn là: {otpCode}");
                if (!emailSent)
                {
                    return StatusCode(500, "Không thể gửi OTP.");
                }
                await _otpService.SaveOtpAsync(appUser, registerDto.Password, otpCode);
                
                Console.WriteLine($"Generated OTP: {otpCode}");
                return Ok("Đã gửi mã OTP đến email của bạn. Vui lòng kiểm tra và xác nhận OTP.");
            }
            catch (Exception e)
            {

                return StatusCode(500, e);
            }
        }
        [HttpPost("registercreator")]
        public async Task<IActionResult> RegisterCreator([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var appUser = new AppUser
                {
                    UserName = registerDto.Username,
                    Email = registerDto.Email
                };

                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);
                if (createdUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(appUser, "Creator");
                    if (roleResult.Succeeded)
                    {
                        return Ok(
                            new NewCreatorDto
                            {
                                Username = appUser.UserName,
                                Email = appUser.Email,
                                Token = await _tokenService.CreateToken(appUser),
                                Roles = ["Creator"]
                            }
                        );
                    }
                    else
                    {
                        return StatusCode(500, roleResult.Errors);
                    }
                }
                else
                {
                    return StatusCode(500, createdUser.Errors);
                }
            }
            catch (Exception e)
            {

                return StatusCode(500, e);
            }
        }
        [HttpPost("verifyotp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto verifyOtpDto)
        {
            try
            {
                var otpInfo = await _otpService.GetOtpInfoAsync(verifyOtpDto.Email.ToLower());
                Console.WriteLine($"Email from VerifyOtpDto: {verifyOtpDto.Email.ToLower()}");
                if (otpInfo.Item1 == null || otpInfo.Item3.Trim() != verifyOtpDto.Otp.Trim())
                {
                    return BadRequest("OTP không hợp lệ.");
                }

                var appUser = otpInfo.Item1;
                var password = otpInfo.Item2;

                var createdUser = await _userManager.CreateAsync(appUser, password);
                if (createdUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(appUser, "User");
                    if (roleResult.Succeeded)
                    {
                        await _otpService.RemoveOtpInfoAsync(appUser.Email);

                        return Ok(new NewUserDto
                        {
                            Username = appUser.UserName,
                            Email = appUser.Email,
                            Token = await _tokenService.CreateToken(appUser),
                            Roles = new[] { "User" }
                        });
                    }
                    else
                    {
                        return StatusCode(500, roleResult.Errors);
                    }
                }
                else
                {
                    return StatusCode(500, createdUser.Errors);
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
    }
}