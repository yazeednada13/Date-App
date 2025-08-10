using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class LoginDto {
    
    [Required]
    public string Email { get; set; } = string.Empty;
    [Required]
    public required string Password { get; set; } = string.Empty;
 }