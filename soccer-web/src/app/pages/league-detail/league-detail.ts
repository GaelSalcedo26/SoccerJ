import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LeagueService } from '../../services/league-service';
import { TeamService } from '../../services/team-service';
import { League } from '../../models/league';
import { Team } from '../../models/team';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-league-detail',
  styleUrl: './league-detail.css',
  templateUrl: './league-detail.html',
})
export class LeagueDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private leagueService = inject(LeagueService);
  private teamService = inject(TeamService);

  leagueId = Number(this.route.snapshot.paramMap.get('id')); // el :id de la URL
  league = signal<League | null>(null);
  enrolled = signal<Team[]>([]);   // equipos inscritos en la liga
  allTeams = signal<Team[]>([]);   // todos los equipos
  error = signal('');
  selectedTeamId: number | null = null;

  // Equipos que se pueden inscribir: habilitados y que todavía no están en la liga.
  // computed() se recalcula solo cuando cambian enrolled o allTeams.
  available = computed(() => {
    const enrolledIds = this.enrolled().map((t) => t.id);
    return this.allTeams().filter((t) => t.enabled && !enrolledIds.includes(t.id));
  });

  ngOnInit(): void {
    this.leagueService.getById(this.leagueId).subscribe({
      next: (data) => this.league.set(data),
      error: (err) => this.error.set(this.readError(err)),
    });
    this.teamService.getAll().subscribe({
      next: (data) => this.allTeams.set(data),
      error: (err) => this.error.set(this.readError(err)),
    });
    this.loadEnrolled();
  }

  loadEnrolled(): void {
    this.leagueService.getTeams(this.leagueId).subscribe({
      next: (data) => this.enrolled.set(data),
      error: (err) => this.error.set(this.readError(err)),
    });
  }

  enroll(): void {
    if (this.selectedTeamId === null) return;
    this.error.set('');
    this.leagueService.enrollTeam(this.leagueId, this.selectedTeamId).subscribe({
      next: () => {
        this.selectedTeamId = null;
        this.loadEnrolled();
      },
      error: (err) => this.error.set(this.readError(err)),
    });
  }

  withdraw(team: Team): void {
    if (!confirm(`¿Retirar a ${team.name} de la liga?`)) return;
    this.error.set('');
    this.leagueService.withdrawTeam(this.leagueId, team.id).subscribe({
      next: () => this.loadEnrolled(),
      error: (err) => this.error.set(this.readError(err)),
    });
  }

  private readError(err: HttpErrorResponse): string {
    if (err.status === 0) return 'No se pudo conectar con la API. ¿Está corriendo?';
    if (err.error?.errors) return (Object.values(err.error.errors) as string[][]).flat().join(' ');
    if (typeof err.error === 'string') return err.error;
    return 'Ocurrió un error inesperado.';
  }
}
