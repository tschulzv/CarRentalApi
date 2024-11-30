using System.Text;
using CarRentalApi.Data;
using CarRentalApi.Models;
using Microsoft.AspNetCore.Authentication;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de logging
builder.Logging.AddConsole(); // Agregar consola como log
builder.Logging.AddDebug();   // Agregar depuración como log

// agregar el contexto de la db
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

/* 
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        try
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
                RoleClaimType = "role" 
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error en la configuración de JWT: {ex.Message}");
            throw;
        }
    });
Console.WriteLine($"Jwt Key: {builder.Configuration["Jwt:Key"]}");
*/

// Configuración de autenticación con cookies
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "login_token"; // El nombre de la cookie que se usará
        options.ExpireTimeSpan = TimeSpan.FromHours(1); // Tiempo de expiración de la cookie
        options.SlidingExpiration = true; // La cookie se renueva automáticamente
        options.LoginPath = "/api/auth/login"; // Ruta para iniciar sesión
        options.LogoutPath = "/api/auth/logout"; // Ruta para cerrar sesión
        options.Cookie.SameSite = SameSiteMode.Lax;  // o SameSiteMode.None dependiendo de tu necesidad
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;  // Asegura que la cookie solo se envíe a través de HTTPS
    });

/* 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowCredentials()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});*/


var app = builder.Build();

/* 
// Middleware personalizado para manejar CORS y solicitudes preflight
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:3000");
    context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
    context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");

    // Manejar solicitudes OPTIONS (preflight)
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        return;
    }

    if (!context.User.Identity.IsAuthenticated && context.Request.Path.StartsWithSegments("/api") && !context.Request.Path.StartsWithSegments("/api/auth/login"))
    {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("Unauthorized");
        return;
    }


    await next();
});

app.UseCors("AllowSpecificOrigins");*/

// Llama al seeder para poblar la base de datos
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        DbInitializer.Initialize(context);
        Console.WriteLine("Database seeding completed.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error during database seeding: {ex.Message}");
    }
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();  // Muestra detalles de las excepciones 
}


// Configurar para servir archivos estáticos desde `wwwroot`
app.UseStaticFiles();

app.UseAuthentication();  

app.UseAuthorization();

app.MapControllers();

app.Run();
