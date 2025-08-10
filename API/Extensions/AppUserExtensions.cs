using System;
using API.DTOs;
using API.Entities;
using API.interfaces;

namespace API.Extensions;

public static class AppUserExtensions
{
    public static UserDto ToDto(this AppUser user, ITokenService tokenService)
    {
        return new UserDto
        {
            DisplayName = user.DisplayName,
            Id = user.Id,
            Email = user.Email,
            ImageUrl = user.ImageUrl,
            Token = tokenService.CreateToken(user),
        };
        
    }
}
