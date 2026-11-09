import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Team } from '../models/team';
import { League } from '../models/league';
import { toDateOnly } from './league-service';

@Service()
export class TeamService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5011/api/team';

  getAll(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }

  getById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  create(team: Team): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, team);
  }

  update(id: number, team: Team): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, team);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Ligas en las que está inscrito el equipo
  getLeagues(teamId: number): Observable<League[]> {
    return this.http
      .get<League[]>(`${this.apiUrl}/${teamId}/leagues`)
      .pipe(map((leagues) => leagues.map(toDateOnly)));
  }
}
