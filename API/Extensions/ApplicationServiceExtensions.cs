using API.Data;
using API.interfaces;
using API.Services;
using API.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ApplicationServiceExtensions {

    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config){

        services.AddControllers();
        services.AddDbContext<DataContext>(opt => {
               opt.UseSqlServer(config.GetConnectionString("DefaultConection"));
});
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// builder.Services.AddOpenApi();
        services.AddCors();
        services.AddScoped<ITokenService , TokenService>();
        services.AddScoped<IPhotoService, PhotoService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddSignalR();
        services.AddSingleton<PresenceTracker>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        
        return services;
    }
}   