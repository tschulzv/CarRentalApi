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
using System.Drawing;

namespace CarRentalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiclesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehiclesController(AppDbContext context)
        {
            _context = context;
        }

        /*
        // GET: api/Vehicles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicles()
        {
            return await _context.Vehicles.ToListAsync();
        }*/

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VehicleDTO>>> GetVehicles()
        {
            var vehicles = await _context.Vehicles.ToListAsync();
            var vehiclesDto = vehicles.Select(ve => ToDTO(ve));

            return Ok(vehiclesDto);
        }

        // GET: api/Vehicles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleDTO>> GetVehicle(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);

            if (vehicle == null)
            {
                return NotFound();
            }

            return ToDTO(vehicle);
        }

        // PUT: api/Vehicles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVehicle(int id, VehicleDTO veDto)
        {
            if (id != veDto.Id)
            {
                return BadRequest();
            }

            var ve = await _context.Vehicles.FindAsync(id);

            if (ve == null)
            {
                return NotFound();
            }

            ve.NumberPlate = veDto.NumberPlate;
            ve.Type = veDto.Type;
            ve.Model = veDto.Model;
            ve.Mark = veDto.Mark;
            ve.Year = veDto.Year;
            ve.Color = veDto.Color;
            ve.SeatsNum = veDto.SeatsNum;
            ve.CostPerDay = veDto.CostPerDay;
            ve.Image = veDto.Image;
            ve.Available = veDto.Available;

            _context.Entry(ve).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehicleExists(id))
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

        // POST: api/Vehicles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Vehicle>> PostVehicle(VehicleDTO veDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Devuelve los errores de validación al cliente
            }
            var vehicle = new Vehicle
            {
                NumberPlate = veDto.NumberPlate,
                Type = veDto.Type,
                Model = veDto.Model,
                Mark = veDto.Mark,
                Year = veDto.Year,
                Color = veDto.Color,
                SeatsNum = veDto.SeatsNum,
                CostPerDay = veDto.CostPerDay,
                Image = veDto.Image,
                Available = veDto.Available
            }; 

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVehicle", new { id = vehicle.Id }, veDto);
        }

        // DELETE: api/Vehicles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                return NotFound();
            }

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VehicleExists(int id)
        {
            return _context.Vehicles.Any(e => e.Id == id);
        }

        private static VehicleDTO ToDTO(Vehicle ve)
        {
            return new VehicleDTO
            {
                Id = ve.Id,
                NumberPlate = ve.NumberPlate,
                Type = ve.Type,
                Model = ve.Model,
                Mark = ve.Mark,
                Year = ve.Year,
                Color = ve.Color,
                SeatsNum = ve.SeatsNum,
                CostPerDay = ve.CostPerDay,
                Image = ve.Image,
                Available = ve.Available
            };
        }
    }
}
