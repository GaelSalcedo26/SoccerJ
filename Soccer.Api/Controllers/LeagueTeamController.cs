using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Soccer.Api.Data;
using Soccer.Api.Models;

namespace Soccer.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]   // → /api/leagueteam
    public class LeagueTeamController : ControllerBase
    {
        private readonly SoccerDbContext _context;

        public LeagueTeamController(SoccerDbContext context)
        {
            _context = context;
        }

        // POST /api/leagueteam/1/2  → inscribe el equipo 2 en la liga 1
        [HttpPost("{leagueId}/{teamId}")]
        public async Task<IActionResult> Enroll(int leagueId, int teamId)
        {
            if (!await _context.Leagues.AnyAsync(l => l.Id == leagueId))
                return NotFound("La liga no existe.");

            if (!await _context.Teams.AnyAsync(t => t.Id == teamId))
                return NotFound("El equipo no existe.");

            bool yaInscrito = await _context.LeagueTeams
                .AnyAsync(lt => lt.LeagueID == leagueId && lt.TeamID == teamId);
            if (yaInscrito)
                return Conflict("El equipo ya está inscrito en esa liga.");   // 409

            _context.LeagueTeams.Add(new LeagueTeam { LeagueID = leagueId, TeamID = teamId });
            await _context.SaveChangesAsync();
            return NoContent();   // 204
        }

        // DELETE /api/leagueteam/1/2  → retira el equipo 2 de la liga 1
        [HttpDelete("{leagueId}/{teamId}")]
        public async Task<IActionResult> Withdraw(int leagueId, int teamId)
        {
            var inscripcion = await _context.LeagueTeams.FindAsync(leagueId, teamId);
            if (inscripcion == null) return NotFound("El equipo no está inscrito en esa liga.");

            _context.LeagueTeams.Remove(inscripcion);
            await _context.SaveChangesAsync();
            return NoContent();   // 204
        }

        // GET /api/league/1/teams  → equipos de la liga 1
        [HttpGet("/api/league/{leagueId}/teams")]
        public async Task<ActionResult<List<Team>>> GetTeamsOfLeague(int leagueId)
        {
            if (!await _context.Leagues.AnyAsync(l => l.Id == leagueId))
                return NotFound("La liga no existe.");

            return await _context.LeagueTeams
                .Where(lt => lt.LeagueID == leagueId)
                .Select(lt => lt.Team)
                .AsNoTracking()
                .ToListAsync();
        }

        // GET /api/team/2/leagues  → ligas del equipo 2
        [HttpGet("/api/team/{teamId}/leagues")]
        public async Task<ActionResult<List<League>>> GetLeaguesOfTeam(int teamId)
        {
            if (!await _context.Teams.AnyAsync(t => t.Id == teamId))
                return NotFound("El equipo no existe.");

            return await _context.LeagueTeams
                .Where(lt => lt.TeamID == teamId)
                .Select(lt => lt.League)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
