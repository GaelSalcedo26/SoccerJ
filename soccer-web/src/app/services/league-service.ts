import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Team } from '../models/team';
import { League } from '../models/league';

// La API manda las fechas como "2026-11-08T00:00:00" (datetime).
// El calendario y la tabla usan solo "2026-11-08", así que se recorta la hora.
export function toDateOnly(league: League): League {
  return {
    ...league,
    startDate: league.startDate.substring(0, 10),
    endDate: league.endDate.substring(0, 10),
  };
}

@Service()
export class LeagueService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5011/api/league';
  private leagueTeamUrl = 'http://localhost:5011/api/leagueteam';

  getAll(): Observable<League[]> {
    return this.http.get<League[]>(this.apiUrl).pipe(map((leagues) => leagues.map(toDateOnly)));
  }

  getById(id: number): Observable<League> {
    return this.http.get<League>(`${this.apiUrl}/${id}`).pipe(map(toDateOnly));
  }

  create(league: League): Observable<League> {
    return this.http.post<League>(this.apiUrl, league);
  }

  update(id: number, league: League): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, league);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Equipos inscritos en la liga
  getTeams(leagueId: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/${leagueId}/teams`);
  }

  // Inscribir un equipo en la liga
  enrollTeam(leagueId: number, teamId: number): Observable<void> {
    return this.http.post<void>(`${this.leagueTeamUrl}/${leagueId}/${teamId}`, null);
  }

  // Retirar un equipo de la liga
  withdrawTeam(leagueId: number, teamId: number): Observable<void> {
    return this.http.delete<void>(`${this.leagueTeamUrl}/${leagueId}/${teamId}`);
  }
}
