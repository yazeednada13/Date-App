using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(DataContext context , ITokenService tokenService) : BaseApiController {

    [HttpPost("register")] // api/account/register
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await EmailExists(registerDto.Email)) return BadRequest("Username is taken");
        return Ok();
        // using var hmac = new HMACSHA512();

        // var user = new AppUser 
        // {
        //     Username = registerDto.Username.ToLower(),
        //     PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
        //     PasswordSalt = hmac.Key
        // };

        // context.Users.Add(user);
        // await context.SaveChangesAsync();

        // return new UserDto {
        //     Username = user.Username,
        //     Email = user.Email,
        //     Id = user.Id,
        //     Token = tokenService.CreateToken(user)
        // };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login (LoginDto loginDto){
        var user = await context.Users.SingleOrDefaultAsync(x => x.Email == loginDto.Email.ToLower());

        if (user == null) {
            return Unauthorized("Invalid email address");
        }

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password");
        }
        return user.ToDto(tokenService);
    }

    private async Task<bool> UserExists (string username){
        return await context.Users.AnyAsync(x => x.DisplayName.ToLower() == username.ToLower());
    }
    private async Task<bool> EmailExists(string Email){
        return await context.Users.AnyAsync(x => x.Email.ToLower() == Email.ToLower());
    }
}