using Microsoft.EntityFrameworkCore;
using Soccer.Api.Models;

namespace Soccer.Api.Data
{
    public class SoccerDbContext : DbContext
    {
        public SoccerDbContext(DbContextOptions<SoccerDbContext> options) : base(options) {}
        

        public DbSet<League> Leagues { get; set; } = null!;
        public DbSet<Team> Teams { get; set; } = null!;
        public DbSet<LeagueTeam> LeagueTeams { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<League>().ToTable("League");
            modelBuilder.Entity<Team>().ToTable("Team");
             modelBuilder.Entity<LeagueTeam>().ToTable("League_Team");


            modelBuilder.Entity<LeagueTeam>()
                .HasKey(lt => new { lt.LeagueID, lt.TeamID });

            modelBuilder.Entity<LeagueTeam>()
                .HasOne(lt => lt.League)
                .WithMany(l => l.LeagueTeams)
                .HasForeignKey(lt => lt.LeagueID);

            modelBuilder.Entity<LeagueTeam>()
                .HasOne(lt => lt.Team)
                .WithMany(t => t.LeagueTeams)
                .HasForeignKey(lt => lt.TeamID);
                
        }
    }
}