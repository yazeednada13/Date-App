using API.Data;
using API.interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ApplicationServiceExtensions {

    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config){

        services.AddControllers();
        services.AddDbContext<DataContext>(opt => {
               opt.UseSqlite(config.GetConnectionString("DefaultConection"));
});
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// builder.Services.AddOpenApi();
        services.AddCors();
        services.AddScoped<ITokenService , TokenService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        return services;
    }
}   