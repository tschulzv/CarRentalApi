using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarRentalApi.Models
{
    public class Rent
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // ids autoincrementados
        public int Id { get; set; }

        [Required]
        // FK y propiedad de navegacion del vehiculo 
        public int VehicleId { get; set; }

        public Vehicle Vehicle { get; set; }

        [Required]
        // FK y propiedad de navegacion del cliente 
        public int ClientId { get; set; }

        public Client Client { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime StartDate { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime ReturnDate { get; set; } 

        [Required]
        public bool Returned { get; set; }

    }
}
