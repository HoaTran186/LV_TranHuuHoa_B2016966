using backend.Data;
using backend.Extensions;
using backend.Models;
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

        [HttpGet("{receiver}")]
        public async Task<IActionResult> GetMessageHistory(string receiver)
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

                Console.WriteLine($"Username: {appUser.UserName}, Receiver: {receiver}");

                var messages = await _context.Messages
                    .Where(m => m.Receiver.ToLower() == appUser.UserName.ToLower() || m.Receiver.ToLower() == receiver)
                    .OrderBy(m => m.Timestamp)
                    .ToListAsync();

                Console.WriteLine($"Found {messages.Count} messages");

                return Ok(messages);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.Error.WriteLine($"Error in GetMessageHistory: {ex}");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

    }
}