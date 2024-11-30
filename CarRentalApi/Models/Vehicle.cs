using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarRentalApi.Models
{
    public enum VehicleType
    {
        Car = 1,
        Motorbike = 2,
        Bicycle = 3
    }
    public class Vehicle
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // hacer que el id sea autoincremental
        public int Id { get; set; }

        [StringLength(7, MinimumLength = 6)]
        public string? NumberPlate { get; set; } // puede ser null (bicis)
        
        [Required]
        public VehicleType Type { get; set; }

        [Required]
        [StringLength(50)]
        public string Model { get; set; }

        [Required]
        [StringLength(50)]
        public string Mark { get; set; }

        [Required]
        [Range(1970, 2050)]
        public int Year { get; set; }

        [Required]
        [StringLength(50)]
        public string Color { get; set; }

        [Required]
        [Range(1, 10)]
        public int SeatsNum { get; set; }

        [Required]
        [Range(1, 500)]
        public double CostPerDay { get; set; }
        
        public string? Image { get; set; }   // puede ser null 

        [Required]
        public bool Available { get; set; } = true;

        // Relación uno a muchos (un vehiculo puede tener muchos alquileres)
        public List<Rent> Rents { get; set; }

    }
}
