using HomeScore.Data.Database;
using HomeScore.Data.Models.Entities;
using HomeScore.Endpoint.Hubs;
using HomeScore.Logic.Classes;
using HomeScore.Logic.Interfaces;
using HomeScore.Repository.Classes;
using HomeScore.Repository.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors();

builder.Services.AddTransient<IAuthenticationLogic, AuthenticationLogic>();
builder.Services.AddTransient<IClubLogic, ClubLogic>();
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddTransient<IManagerLogic, ManagerLogic>();
builder.Services.AddTransient<IPlayerLogic, PlayerLogic>();
builder.Services.AddTransient<IStadiumLogic, StadiumLogic>();
builder.Services.AddTransient<IUserLogic, UserLogic>();

builder.Services.AddTransient<IClubRepository, ClubRepository>();
builder.Services.AddTransient<IManagerRepository, ManagerRepository>();
builder.Services.AddTransient<IPlayerRepository, PlayerRepository>();
builder.Services.AddTransient<IStadiumRepository, StadiumRepository>();
builder.Services.AddTransient<IUserClubRepository, UserClubRepository>();

builder.Services.AddDbContext<DatabaseContext>();
builder.Services.AddTransient<DbContext, DatabaseContext>();

builder.Services.AddIdentity<User, IdentityRole>(
                     option =>
                     {
                         option.Password.RequireDigit = true;
                         option.Password.RequiredLength = 6;
                         option.Password.RequireNonAlphanumeric = true;
                         option.Password.RequireUppercase = true;
                         option.Password.RequireLowercase = true;
                         option.User.RequireUniqueEmail = true;
                         option.SignIn.RequireConfirmedEmail = true;
                     }
                 ).AddEntityFrameworkStores<DatabaseContext>().AddDefaultTokenProviders();

builder.Services.AddAuthentication(option =>
{
    option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = true;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = "http://www.security.org",
        ValidIssuer = "http://www.security.org",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Cristiano Ronaldo Lionel Messi Neymar Kylian Mbappé Erling Haaland"))
    };
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseCors(x => x
     .AllowCredentials()
     .AllowAnyMethod()
     .AllowAnyHeader()
     .WithOrigins("http://localhost:4200"));

app.UseAuthentication();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<EventHub>("/hub");
});

app.Run();
