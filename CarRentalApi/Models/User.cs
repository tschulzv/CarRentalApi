using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarRentalApi.Models
{
    public enum UserRole
    {
        Admin,
        User
    }
    public class User
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // ids autoincrementados
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
        public string Username {  get; set; }

        [Required]
        [StringLength(255)]
        public string Password { get; set; }

        [Required]
        public UserRole Role { get; set; } = UserRole.User; // Rol por defecto: Usuario normal

        [Required]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime LastSession {  get; set; } = DateTime.Now;

    }

}
