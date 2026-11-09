using System.ComponentModel.DataAnnotations;
namespace Soccer.Api.Models
{
    
    public class Team
    {
        public int Id { get; set; }
        
        public bool Enabled { get; set; } = true;

    [RegularExpression(@".*\p{L}.*\p{L}.*", ErrorMessage = "El nombre debe tener al menos 2 letras.")]
    public string Name { get; set; } = string.Empty;

    [RegularExpression(@".*\p{L}.*\p{L}.*", ErrorMessage = "El país debe tener al menos 2 letras.")]
    public string Country { get; set; } = string.Empty;

    [Range(11, 22, ErrorMessage = "Un equipo debe tener entre 11 y 22 jugadores.")]
    public int PlayersQuantity { get; set; }

        public List<LeagueTeam> LeagueTeams { get; set; } = new ();
    }
}