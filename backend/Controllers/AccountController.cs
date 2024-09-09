using backend.Dtos.Account;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IEmailSender _emailSender;
        public AccountController(IMemoryCache cache, UserManager<AppUser> userManager, ITokenService tokenService,
        SignInManager<AppUser> signInManager, IEmailSender emailSender)
        {
            _cache = cache;
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _emailSender = emailSender;
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
        // [HttpPost("register-user")]
        // public async Task<IActionResult> RegisterUser([FromBody] RegisterDto registerDto)
        // {
        //                 try
        //     {
        //         if (!ModelState.IsValid)
        //         {
        //             return BadRequest(ModelState);
        //         }
        //         var appUser = new AppUser
        //         {
        //             UserName = registerDto.Username,
        //             Email = registerDto.Email
        //         };

        //         var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);
        //         if (createdUser.Succeeded)
        //         {
        //             var roleResult = await _userManager.AddToRoleAsync(appUser, "User");
        //             if (roleResult.Succeeded)
        //             {
        //                 return Ok(
        //                     new NewCreatorDto
        //                     {
        //                         Username = appUser.UserName,
        //                         Email = appUser.Email,
        //                         Token = await _tokenService.CreateToken(appUser),
        //                         Roles = ["User"]
        //                     }
        //                 );
        //             }
        //             else
        //             {
        //                 return StatusCode(500, roleResult.Errors);
        //             }
        //         }
        //         else
        //         {
        //             return StatusCode(500, createdUser.Errors);
        //         }
        //     }
        //     catch (Exception e)
        //     {

        //         return StatusCode(500, e);
        //     }
        // }
        [HttpPost("registeruser")]
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

                var otp = new Random().Next(100000, 999999).ToString();
                var cacheKey = $"OTP_{registerDto.Email}";
                _cache.Set(cacheKey, otp, TimeSpan.FromMinutes(5));

                var emailSubject = "Your OTP for Registration";
                var emailBody = $@"
            <!DOCTYPE html>
            <html lang='vi'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Email OTP</title>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }}
                    .email-container {{
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }}
                    .email-header {{
                        text-align: center;
                    }}
                    .email-header img {{
                        max-width: 150px;
                    }}
                    .email-body {{
                        margin-top: 20px;
                    }}
                    .email-body h3 {{
                        font-size: 18px;
                        color: #333;
                    }}
                    .otp-code {{
                        font-size: 24px;
                        color: #1a73e8;
                        font-weight: bold;
                    }}
                    .email-footer {{
                        margin-top: 40px;
                        font-size: 12px;
                        color: #888;
                        text-align: center;
                    }}
                </style>
            </head>
            <body>
                <div class='email-container'>
                    <div class='email-header'>
                        <img src='https://drive.google.com/uc?export=view&id=1QFGIVQyn9mkNitNeQy1w9YuxIyy3F9zh' alt='Inno Trade Logo'>
                    </div>
                    <div class='email-body'>
                        <h3>Chào bạn,</h3>
                        <p>Bạn đang Đăng Ký Tài InnoTrade, Mã xác nhận là <span class='otp-code'>{otp}</span>.</p>
                        <p>Vui lòng hoàn thành xác nhận trong vòng 5 phút.</p>
                        <br>
                        <p>Inno Trade</p>
                    </div>
                    <div class='email-footer'>
                        <p>Đây là thư từ hệ thống, vui lòng không trả lời thư.</p>
                    </div>
                </div>
            </body>
            </html>
        ";

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
                            return Ok(new NewCreatorDto
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
        [HttpDelete("deleteuser/{identifier}")]
        public async Task<IActionResult> DeleteUser([FromRoute] string identifier)
        {
            try
            {
                // Tìm người dùng theo ID hoặc Username
                AppUser user = await _userManager.FindByIdAsync(identifier);

                if (user == null)
                {
                    user = await _userManager.FindByNameAsync(identifier);
                    if (user == null)
                    {
                        return NotFound("User not found.");
                    }
                }

                // Xóa người dùng
                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    return StatusCode(500, "Error deleting user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                }

                return Ok(new { message = "User deleted successfully." });
            }
            catch (Exception e)
            {
                return StatusCode(500, $"An error occurred: {e.Message}");
            }
        }
    }
}