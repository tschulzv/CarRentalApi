using CarRentalApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CarRentalApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Vehicle> Vehicles { get; set; }

        public DbSet<Rent> Rents { get; set; }

        public DbSet<Client> Clients { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Vehicle>().ToTable("Vehicles")
                .Property(v => v.Type)
                .HasConversion<string>(); // convertir enum a string

            modelBuilder.Entity<Vehicle>().ToTable("Vehicles")
                .Property(v => v.Available)
                .HasDefaultValue(true); // Valor por defecto en la base de datos

            modelBuilder.Entity<Client>().ToTable("Clients");
            modelBuilder.Entity<Rent>().ToTable("Rents");
            modelBuilder.Entity<User>().ToTable("Users")
                .Property(v => v.LastSession)
                .HasDefaultValueSql("GETDATE()"); // Valor por defecto en la base de datos;

            modelBuilder.Entity<User>()
               .Property(u => u.Role)
               .HasConversion<string>();

        }

    }
}
