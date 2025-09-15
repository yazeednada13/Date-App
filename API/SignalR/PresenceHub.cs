using System;
using System.Security.Claims;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;


public class PresenceHub(PresenceTracker presenceTracker) : Hub
{
    public override async Task OnConnectedAsync()
    {
       Console.WriteLine($"PresenceHub connected: {GetUserId()} | Connection: {Context.ConnectionId}");
    await presenceTracker.UserConnected(GetUserId(), Context.ConnectionId);
    await Clients.Others.SendAsync("UserOnline", GetUserId());

    var currentUsers = await presenceTracker.GetOnlineUsers();
    Console.WriteLine($"Online Users: {string.Join(',', currentUsers)}");
    await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
    }
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await presenceTracker.UserDisconnected(GetUserId(), Context.ConnectionId);
        await Clients.Others.SendAsync("UserOffline", GetUserId());

        var currentUsers = await presenceTracker.GetOnlineUsers();
        await Clients.All.SendAsync("GetOnlineUsers", currentUsers);
    

        await base.OnDisconnectedAsync(exception);
    }

    private string GetUserId()
    {
        return Context.User?.GetMemberId()
            ?? throw new HubException("Cannot get member id");
    }
}
