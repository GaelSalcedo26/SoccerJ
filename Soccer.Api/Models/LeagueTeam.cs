namespace Soccer.Api.Models
{

public class LeagueTeam
{
    public int LeagueID { get; set; }
    public int TeamID { get; set; }
    public League League { get; set; } = null!;
    public Team Team { get; set; } = null!;

    
}
}