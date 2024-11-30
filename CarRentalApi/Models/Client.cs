
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarRentalApi.Models
{
    public class Client
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // ids autoincrementados
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(100)]
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Formato de correo electrónico inválido")]
        public string? Email { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 9)]
        public string Phone { get; set; }

        // relación uno a muchos (un cliente puede tener muchos alquileres)
        public List<Rent> Rents { get; set; }

    }
}
