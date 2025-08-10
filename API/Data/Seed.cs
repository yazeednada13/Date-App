using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.Json;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(DataContext context)
    {
        // Check if the Users table is empty
        if (await context.Users.AnyAsync()) return;

        var memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var members = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData, options);
        if (members == null) return;

        foreach (var member in members)

        {
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                Id = member.Id,
                Email = member.Email,
                DisplayName = member.DisplayName,
                ImageUrl = member.ImageUrl,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd")),
                PasswordSalt = hmac.Key,
                Member = new Member
                {
                    Id = member.Id,
                    DisplayName = member.DisplayName,
                    Description = member.Description,
                    ImageUrl = member.ImageUrl,
                    Gender = member.Gender,
                    DateOfBirth = member.DateOfBirth,
                    City = member.City,
                    Country = member.Country,
                    LastActive = member.LastActive,
                    Created = member.Created
                }
            };
            user.Member.Photos.Add(new Photo
            {
                Url = member.ImageUrl,
                MemberId = member.Id,
            });
            context.Users.Add(user);
        }
        await context.SaveChangesAsync();
    }
}

