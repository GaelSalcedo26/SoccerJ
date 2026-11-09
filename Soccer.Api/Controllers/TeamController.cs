using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Soccer.Api.Data;
using Soccer.Api.Models;

namespace Soccer.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]   // → /api/team
    public class TeamController : ControllerBase
    {
        private readonly SoccerDbContext _context;

        public TeamController(SoccerDbContext context)
        {
            _context = context;
        }

        // GET /api/team  → todos los equipos
        [HttpGet]
        public async Task<ActionResult<List<Team>>> GetAll()
        {
            return await _context.Teams.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Team>> GetById(int id)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null) return NotFound();   // 404
            return team;
        }

        // POST /api/team  → crear
        [HttpPost]
        public async Task<ActionResult<Team>> Create(Team team)
        {
            team.Id = 0;
            _context.Teams.Add(team);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = team.Id }, team);   // 201
        }

        // PUT /api/team/5  → editar
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Team team)
        {
            var existing = await _context.Teams.FindAsync(id);
            if (existing == null) return NotFound();   // 404

            existing.Name = team.Name;
            existing.Country = team.Country;
            existing.PlayersQuantity = team.PlayersQuantity;
            existing.Enabled = team.Enabled;

            await _context.SaveChangesAsync();
            return NoContent();   // 204
        }

        // DELETE /api/team/5  → borrar
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null) return NotFound();   // 404

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();
            return NoContent();   // 204
        }
    }
}
