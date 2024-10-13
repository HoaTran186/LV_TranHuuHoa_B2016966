using backend.Data;
using backend.Dtos.Messages;
using backend.Extensions;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Account
{
    [Route("api/messages")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly UserManager<AppUser> _userManager;

        public MessagesController(ApplicationDBContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMessageHistory()
        {
            var messages = await _context.Messages
           .OrderBy(m => m.Timestamp)
           .ToListAsync();

            return Ok(messages);
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

                var message = new Messages
                {
                    UserId = appUser.Id,
                    Content = messageDto.Content,
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
    }
}