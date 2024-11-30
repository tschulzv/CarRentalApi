using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarRentalApi.Data;
using CarRentalApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace CarRentalApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Rents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RentDTO>>> GetRents()
        {
            var rents = await _context.Rents.ToListAsync();
            var rentDtos = rents.Select(rent => ToDTO(rent));

            return Ok(rentDtos);
        }

        // GET: api/Rents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RentDTO>> GetRent(int id)
        {
            var rent = await _context.Rents.FindAsync(id);

            if (rent == null)
            {
                return NotFound();
            }

            return ToDTO(rent);
        }

        // PUT: api/Rents/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRent(int id, RentDTO rentDto)
        {
            var rent = await _context.Rents.FirstOrDefaultAsync(r => r.Id == id);

            if (rent == null)
            {
                return NotFound();
            }

            // Actualizar las propiedades del cliente
            rent.VehicleId = rentDto.VehicleId;
            rent.ClientId = rentDto.ClientId;
            rent.StartDate = rentDto.StartDate;
            rent.ReturnDate = rentDto.ReturnDate;
            rent.Returned = rentDto.Returned;


            _context.Entry(rent).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Rents
        [HttpPost]
        public async Task<ActionResult<Rent>> PostRent(RentDTO rentDto)
        {
            // Obtener el vehículo asociado al alquiler
            var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == rentDto.VehicleId);

            if (vehicle == null)
            {
                return NotFound("El vehículo no existe.");
            }

            if (!vehicle.Available)
            {
                return BadRequest("El vehículo no está disponible.");
            }

            // Obtener el cliente asociado al alquiler
            var client = await _context.Clients.FirstOrDefaultAsync(c => c.Id == rentDto.ClientId);

            if (client == null)
            {
                return NotFound("El cliente no existe.");
            }


            // Marcar el vehículo como no disponible
            vehicle.Available = false;

            var rent = new Rent
            {
                VehicleId = rentDto.VehicleId,
                ClientId = rentDto.ClientId,
                StartDate = rentDto.StartDate,
                ReturnDate = rentDto.ReturnDate,
                Returned = false
            };

            // Agregar el alquiler al contexto
            _context.Rents.Add(rent);

            // Marcar el vehículo como modificado en el contexto para guardar los cambios
            _context.Entry(vehicle).State = EntityState.Modified;

            try
            {
                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al guardar el alquiler y el vehículo: {ex.Message}");
            }

            return CreatedAtAction("GetRent", new { id = rent.Id }, rentDto);
        }


        // DELETE: api/Rents/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRent(int id)
        {
            var rent = await _context.Rents.FindAsync(id);
            if (rent == null)
            {
                return NotFound();
            }

            _context.Rents.Remove(rent);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RentExists(int id)
        {
            return _context.Rents.Any(e => e.Id == id);
        }


        // Devolver un vehiculo 
        [HttpPut("return/{rentId}")]
        public async Task<IActionResult> ReturnVehicle(int rentId)
        {

            var rent = await _context.Rents.FirstOrDefaultAsync(r => r.Id == rentId);
            if (rent == null)
            {
                return NotFound("Alquiler no encontrado.");
            }

            rent.Returned = true;

            // buscar el vehiculo con el id contenido en la renta y poner en available
            var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == rent.VehicleId);
            if (vehicle == null)
            {
                return NotFound("Vehiculo no encontrado.");
            }
            vehicle.Available = true;

            // fguardar cambios en la db
            _context.Entry(rent).State = EntityState.Modified;
            _context.Entry(vehicle).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al actualizar: {ex.Message}");
            }

            return NoContent();
        }

        public static RentDTO ToDTO(Rent rent)
        {
            return new RentDTO
            {
                Id = rent.Id,
                VehicleId = rent.VehicleId,
                ClientId = rent.ClientId,
                StartDate = rent.StartDate,
                ReturnDate = rent.ReturnDate,
                Returned = rent.Returned
            };
        }
    }
}
