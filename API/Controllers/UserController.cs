using API.Controllers;
using API.Data;
using API.DTOs;
using API.Entities;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class UserController(IUserRepository userRepository) : BaseApiController {
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers() {
        var users = await userRepository.GetMembersAsync();

        
        return Ok(users);
    }
    
    [HttpGet("{username}")] // api/user/1
    public async  Task<ActionResult<MemberDto>> GetUser(string username) {
        // await > I use it when I request data from Database
        var user = await userRepository.GetMemberAsync(username);

        if (user == null ) return NotFound();

        return Ok(user);
 
    }
}