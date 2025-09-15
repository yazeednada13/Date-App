using System;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace API.Entities;

public class Connection(string connectionId, string userId)
{
    public string ConnectionId { get; set; } = connectionId;
    public string UserId { get; set; } = userId;

    // Nav Property
    public Group Group { get; set; } = null!;
}
