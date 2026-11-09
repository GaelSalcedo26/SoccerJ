using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Soccer.Api.Data;
using Soccer.Api.Models;

namespace Soccer.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]   // → /api/League
    public class LeagueController : ControllerBase
    {
        private readonly SoccerDbContext _context;

        public LeagueController(SoccerDbContext context)
        {
            _context = context;
        }

        // GET /api/League  → todos los ligas
        [HttpGet]
        public async Task<ActionResult<List<League>>> GetAll()
        {
            return await _context.Leagues.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<League>> GetById(int id)
        {
            var league = await _context.Leagues .FindAsync(id);
            if (league == null) return NotFound();   // 404
            return league;
        }

        // POST /api/League  → crear
        [HttpPost]
        public async Task<ActionResult<League>> Create(League league)
        {
            league.Id = 0;
            _context.Leagues.Add(league);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = league.Id }, league);   // 201
        }

        // PUT /api/League/5  → editar
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, League league)
        {
            var existing = await _context.Leagues.FindAsync(id);
            if (existing == null) return NotFound();   // 404

            existing.Name = league.Name;
            existing.Country = league.Country;
            existing.StartDate = league.StartDate;
            existing.EndDate = league.EndDate;
            existing.Enabled = league.Enabled;

            await _context.SaveChangesAsync();
            return NoContent();   // 204
        }

        // DELETE /api/League/5  → borrar
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var league = await _context.Leagues.FindAsync(id);
            if (league == null) return NotFound();   // 404

            _context.Leagues.Remove(league);
            await _context.SaveChangesAsync();
            return NoContent();   // 204
        }
    }
}
