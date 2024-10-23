using Microsoft.AspNetCore.SignalR;


namespace backend.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
        public Task SendMessageToGroup(string receiver, string message)
        {
            return Clients.Group(receiver).SendAsync("ReceiveMessage"
                , Context.User.Identity.Name, message);
        }
        public override Task OnConnectedAsync()
        {
            var userName = Context.User?.Identity?.Name ?? "Anonymous";
            Groups.AddToGroupAsync(Context.ConnectionId, userName);
            return base.OnConnectedAsync();
        }
    }
}