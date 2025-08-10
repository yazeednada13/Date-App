using API.Controllers;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API;
 public class BuggyController(DataContext context):BaseApiController {
   
    
    [HttpGet("auth")]
    public IActionResult GetAuth(){
        return Unauthorized();
    }
    [HttpGet("not-found")]
    public IActionResult GetNotFound(){
        return NotFound();
    }

    [HttpGet("server-error")]
    public ActionResult<AppUser> GetServerError(){
        var thing = context.Users.Find(-1) ?? throw new Exception("This is a server error");
        return thing;

    }
    [HttpGet("bad-request")]
    public ActionResult<AppUser> GetBadRequest(){
        return BadRequest("This was not a good request"); 
    }
 }