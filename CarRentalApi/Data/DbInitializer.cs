using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using CarRentalApi.Models;
using System.Diagnostics;

namespace CarRentalApi.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {

            // Look for any vehicles.
            if (context.Vehicles.Any() && context.Users.Any())
            {
                Console.WriteLine("ya se cargaron los datos iniciales");
                return;   // DB has been seeded
            }

            Console.WriteLine("Cargando datos iniciales");

            // crear el usuario admin si aun no existen usuarios 
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("admin");
            context.Users.Add(new User
            {
                Username = "admin",
                Name = "Tania Schulz",
                Password = passwordHash,
                Role = UserRole.Admin
            });

            var vehicles = new Vehicle[]
            {
                new Vehicle
                {
                    NumberPlate = "ABC123",
                    Type = VehicleType.Car,
                    Model = "Corolla",
                    Mark = "Toyota",
                    Year = 2021,
                    Color = "Blanco",
                    SeatsNum = 5,
                    CostPerDay = 50,
                    Image = "https://www.toyota.com.py/asset/images/overview/corolla/modelos/perla.png",
                    Available = true
                },
                new Vehicle
                {
                    NumberPlate = "DEF456",
                    Type = VehicleType.Car,
                    Model = "Civic",
                    Mark = "Honda",
                    Year = 2019,
                    Color = "Negro",
                    SeatsNum = 5,
                    CostPerDay = 55,
                    Image = "https://65e81151f52e248c552b-fe74cd567ea2f1228f846834bd67571e.ssl.cf1.rackcdn.com/ldm-images/2019-Honda-Civic-CRYSTAL_BLACK_PEARL.png",
                    Available = true
                },
                new Vehicle
                {
                    NumberPlate = "GHI789",
                    Type = VehicleType.Car,
                    Model = "Mustang",
                    Mark = "Ford",
                    Year = 2020,
                    Color = "Rojo",
                    SeatsNum = 4,
                    CostPerDay = 100,
                    Image = "https://di-uploads-pod41.dealerinspire.com/gullofordofconroe/uploads/2021/02/2020-Ford-Mustang-MLP-Hero.png",
                    Available = true
                },
                new Vehicle
                {
                    NumberPlate = "JKL012",
                    Type = VehicleType.Car,
                    Model = "Model S",
                    Mark = "Tesla",
                    Year = 2022,
                    Color = "Azul",
                    SeatsNum = 5,
                    CostPerDay = 150,
                    Image = "https://platform.cstatic-images.com/large/in/v2/stock_photos/b22f5588-2758-46c8-a188-8e104a5aa09e/71f4b3cf-0408-416f-9a60-b2a5bd40b81a.png",
                    Available = true
                },
                new Vehicle
                {
                    NumberPlate = "MNO345",
                    Type = VehicleType.Car,
                    Model = "Wrangler",
                    Mark = "Jeep",
                    Year = 2018,
                    Color = "Negro",
                    SeatsNum = 4,
                    CostPerDay = 80,
                    Image = "https://file.kelleybluebookimages.com/kbb/base/evox/CP/11719/2018-Jeep-Wrangler-front_11719_032_1918x1031_PAU_cropped.png",
                    Available = true
                },
                new Vehicle
                {
                    NumberPlate = "PQR678",
                    Type = VehicleType.Motorbike,
                    Model = "Ninja ZX-6R",
                    Mark = "Kawasaki",
                    Year = 2021,
                    Color = "Verde",
                    SeatsNum = 2,
                    CostPerDay = 40,
                    Image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrUkxIzadX3YXWiPbJ8dcbPyRe5bq3gr427Q&s",
                    Available = true
                },
                new Vehicle
                {
                    NumberPlate = "STU901",
                    Type = VehicleType.Motorbike,
                    Model = "CBR600RR",
                    Mark = "Honda",
                    Year = 2020,
                    Color = "Negro",
                    SeatsNum = 2,
                    CostPerDay = 45,
                    Image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0vx-MzhDW_MiT4IXRQx0sVRlOr0xoe-uUog&s",
                    Available = true
                },
                new Vehicle
                {
                    NumberPlate = "VWX234",
                    Type = VehicleType.Bicycle,
                    Model = "Mountain Bike",
                    Mark = "Trek",
                    Year = 2022,
                    Color = "Azul",
                    SeatsNum = 1,
                    CostPerDay = 15,
                    Image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1tlSfhaPx9nA_RN94u0XVHH8jSCzLWcj8mg&s",
                    Available = true
                },
                new Vehicle
                {
                    NumberPlate = "YZA567",
                    Type = VehicleType.Bicycle,
                    Model = "Avalanche",
                    Mark = "GT",
                    Year = 2021,
                    Color = "Blanco",
                    SeatsNum = 1,
                    CostPerDay = 20,
                    Image = "https://www.carmabike.es/wp-content/uploads/2022/11/g21_g27401m_29-m-avalanche-sport_gry_pd.png",
                    Available = true
                }

            };

            foreach (Vehicle s in vehicles)
            {
                context.Vehicles.Add(s);
            }

            context.SaveChanges();

        }
    }
}