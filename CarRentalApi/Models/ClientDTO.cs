using System.ComponentModel.DataAnnotations;

namespace CarRentalApi.Models
{
    public class ClientDTO
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(100)]
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Formato de correo electrónico inválido")]
        public string Email { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 9)]
        public string Phone { get; set; }
    }
}
