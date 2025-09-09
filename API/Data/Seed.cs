using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.Json;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManger)
    {
        // Check if the Users table is empty
        if (await userManger.Users.AnyAsync()) return;

        var memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var members = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData, options);
        if (members == null) return;

        foreach (var member in members)
        {

            var user = new AppUser
            {
                Id = member.Id,
                Email = member.Email,
                DisplayName = member.DisplayName,
                ImageUrl = member.ImageUrl,
                UserName = member.Email,
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
            var result = await userManger.CreateAsync(user, "Pa$$w0rd");

            if (!result.Succeeded)
            {
                Console.WriteLine(result.Errors.First().Description);
            }
            await userManger.AddToRoleAsync(user, "Member");
        }

        var admin = new AppUser
        {
            UserName = "admin@test.com",
            Email = "admin@test.com",
            DisplayName = "Admin"
        };

        await userManger.CreateAsync(admin, "Pa$$w0rd");
        await userManger.AddToRolesAsync(admin, ["Admin", "Moderator"]);
        
    }
}

