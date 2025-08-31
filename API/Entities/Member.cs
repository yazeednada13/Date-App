using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Member
{
    // Primary key + Foreign key to AppUser at the same time
    public string Id { get; set; } = null!;
    public DateOnly DateOfBirth { get; set; }
    public string? ImageUrl { get; set; }
    public required string DisplayName { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public required string Gender { get; set; }
    public string? Description { get; set; }
    public required string City { get; set; }
    public required string Country { get; set; }

    // Navigation properties
    [JsonIgnore]
    public List<Photo> Photos { get; set; } = [];
    [JsonIgnore]
    public List<MemberLike> LikedByMembers { get; set; } = [];
    [JsonIgnore]
    public List<MemberLike> LikedMembers { get; set; } = [];
    [ForeignKey(nameof(Id))]
    [JsonIgnore]
    // Each Member is associated with an AppUser in same Id
    public AppUser User { get; set; } = null!;
    

}
