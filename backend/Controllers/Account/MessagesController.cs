using backend.Data;
using backend.Dtos.Messages;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Account
{
    [Route("api/account/messages")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMessageRepository _messageRepo;

        public MessagesController(ApplicationDBContext context, UserManager<AppUser> userManager, IMessageRepository messageRepo)
        {
            _context = context;
            _userManager = userManager;
            _messageRepo = messageRepo;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostMessage(SendMessagesDto messageDto)
        {
            try
            {
                var username = User.GetUserName();
                if (string.IsNullOrEmpty(username))
                {
                    return Unauthorized("User is not authenticated.");
                }

                var appUser = await _userManager.FindByNameAsync(username);
                if (appUser == null)
                {
                    return NotFound($"User '{username}' not found.");
                }

                // Mã hóa nội dung tin nhắn trước khi lưu
                var encryptedContent = new EncryptionHelper().Encrypt(messageDto.Content);

                var message = new Messages
                {
                    SenderId = appUser.Id,
                    ReceiveId = messageDto.ReceiveId,
                    Content = encryptedContent, // Lưu tin nhắn đã mã hóa
                    Timestamp = DateTime.UtcNow
                };

                _context.Messages.Add(message);
                await _context.SaveChangesAsync();

                return Ok(message);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in PostMessage: {ex}");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMessageHistory()
        {
            try
            {
                var messages = await _context.Messages.OrderBy(m => m.Timestamp).ToListAsync();

                // Xử lý giải mã và bắt lỗi nếu không thể giải mã
                var decryptedMessages = messages.Select(m =>
                {
                    try
                    {
                        return new
                        {
                            m.Id,
                            m.SenderId,
                            m.ReceiveId,
                            Content = new EncryptionHelper().Decrypt(m.Content), // Giải mã tin nhắn
                            m.Timestamp
                        };
                    }
                    catch (FormatException ex)
                    {
                        Console.Error.WriteLine($"Error decrypting message: {ex.Message}");
                        return new
                        {
                            m.Id,
                            m.SenderId,
                            m.ReceiveId,
                            Content = "Error: Unable to decrypt message.", // Nếu giải mã thất bại, trả về thông báo lỗi
                            m.Timestamp
                        };
                    }
                });

                return Ok(decryptedMessages);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in GetMessageHistory: {ex.Message} - StackTrace: {ex.StackTrace}");
                return StatusCode(500, "An error occurred while retrieving messages.");
            }
        }
        [HttpGet("messages")]
        public async Task<IActionResult> GetMessages(string senderUserId, string receiverUserId)
        {
            var messages = await _messageRepo.GetMessagesBetweenUsers(senderUserId, receiverUserId);
            var decryptedMessages = messages.Select(m =>
               {
                   try
                   {
                       return new
                       {
                           m.Id,
                           m.SenderId,
                           m.ReceiveId,
                           Content = new EncryptionHelper().Decrypt(m.Content), // Giải mã tin nhắn
                           m.Timestamp
                       };
                   }
                   catch (FormatException ex)
                   {
                       Console.Error.WriteLine($"Error decrypting message: {ex.Message}");
                       return new
                       {
                           m.Id,
                           m.SenderId,
                           m.ReceiveId,
                           Content = "Error: Unable to decrypt message.", // Nếu giải mã thất bại, trả về thông báo lỗi
                           m.Timestamp
                       };
                   }
               });
            if (messages == null)
            {
                return NotFound("No messages found between these users");
            }

            return Ok(decryptedMessages);
        }
    }
}