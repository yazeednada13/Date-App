using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API;
[ApiController]
[Route("api/[controller]")] 
public class UserController(DataContext context) : ControllerBase {

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers() {
        var users = await context.Users.ToListAsync();
        return Ok(users);
    }
    [HttpGet("{id:int}")] // api/user/1
    public async  Task<ActionResult<AppUser>> GetUser(int id) {
        // await > I use it when I request data from Database
        var user = await context.Users.FindAsync(id);

        if (user == null ) return NotFound();

        return Ok(user);
    }
}