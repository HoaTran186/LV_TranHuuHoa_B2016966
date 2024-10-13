using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace backend.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDBContext _context;
        public ChatHub(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public override Task OnConnectedAsync()
        {
            var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!String.IsNullOrEmpty(UserId))
            {
                var userName = _context.Users.FirstOrDefault(u => u.Id == UserId).UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserConnected", UserId, userName);
                HubConnections.AddUserConnection(UserId, Context.ConnectionId);
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (HubConnections.HasUserConnection(UserId, Context.ConnectionId))
            {
                var UserConnections = HubConnections.Users[UserId];
                UserConnections.Remove(Context.ConnectionId);

                // Chỉ xóa entry trong dictionary nếu không còn connection nào cho user đó
                if (!UserConnections.Any())
                {
                    HubConnections.Users.Remove(UserId);
                }
            }

            if (!string.IsNullOrEmpty(UserId))
            {
                var userName = _context.Users.FirstOrDefault(u => u.Id == UserId)?.UserName; //Thêm ?. để tránh null exception
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserDisconnected", UserId, userName);

                // Không cần thêm lại connection ở đây vì connection đã bị đóng
            }
            return base.OnDisconnectedAsync(exception);
        }
        public async Task SendAddRoomMessage(int maxRoom, int roomId, string roomName)
        {
            var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _context.Users.FirstOrDefault(u => u.Id == UserId).UserName;

            await Clients.All.SendAsync("ReceiveAddRoomMessage", maxRoom, roomId, roomName, UserId, userName);
        }

        public async Task SendDeleteRoomMessage(int deleted, int selected, string roomName)
        {
            var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _context.Users.FirstOrDefault(u => u.Id == UserId).UserName;

            await Clients.All.SendAsync("ReceiveDeleteRoomMessage", deleted, selected, roomName, userName);
        }
        public async Task SendPublicMessage(int roomId, string message, string roomName)
        {
            await Clients.Group(roomName).SendAsync("ReceivePublicMessage", roomId, Context.UserIdentifier, message, roomName);
        }

        public async Task SendPrivateMessage(string receiverId, string message, string userName)
        {
            await Clients.User(receiverId).SendAsync("ReceivePrivateMessage", Context.UserIdentifier, userName, receiverId, message, userName);
        }
        // public async Task SendPublicMessage(int roomId, string message, string roomName)
        // {
        //     var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        //     var userName = _context.Users.FirstOrDefault(u => u.Id == UserId).UserName;

        //     await Clients.All.SendAsync("ReceivePublicMessage", roomId, UserId, userName, message, roomName);
        // }

        // public async Task SendPrivateMessage(string receiverId, string message, string receiverName)
        // {
        //     var senderId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        //     var sender = _context.Users.FirstOrDefault(u => u.Id == senderId);
        //     if (sender == null)
        //     {
        //         throw new Exception("Sender not found.");
        //     }
        //     var senderName = sender.UserName;

        //     var receiver = _context.Users.FirstOrDefault(u => u.Id == receiverId);
        //     if (receiver == null)
        //     {
        //         throw new Exception("Receiver not found.");
        //     }

        //     var users = new string[] { senderId, receiverId };

        //     await Clients.Users(users).SendAsync("ReceivePrivateMessage", senderId, senderName, receiverId, message, Guid.NewGuid(), receiverName);
        // }

        public async Task SendOpenPrivateChat(string receiverId)
        {
            var username = Context.User.FindFirstValue(ClaimTypes.Name);
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            await Clients.User(receiverId).SendAsync("ReceiveOpenPrivateChat", userId, username);
        }

        public async Task SendDeletePrivateChat(string chartId)
        {
            await Clients.All.SendAsync("ReceiveDeletePrivateChat", chartId);
        }

        //public async Task SendMessageToAll(string user, string message)
        //{
        //    await Clients.All.SendAsync("MessageReceived", user, message);
        //}
        //[Authorize]
        //public async Task SendMessageToReceiver(string sender, string receiver, string message)
        //{
        //    var userId = _context.Users.FirstOrDefault(u => u.Email.ToLower() == receiver.ToLower()).Id;

        //    if (!string.IsNullOrEmpty(userId))
        //    {
        //        await Clients.User(userId).SendAsync("MessageReceived", sender, message);
        //    }

        //}

    }
}