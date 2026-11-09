import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeagueService } from '../../services/league-service';
import { League } from '../../models/league';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-leagues',
  styleUrl: './leagues.css',
  templateUrl: './leagues.html',
})
export class Leagues implements OnInit {
  private leagueService = inject(LeagueService);

  leagues = signal<League[]>([]);
  editing = signal(false);
  error = signal('');
  form: League = this.emptyLeague();

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.leagueService.getAll().subscribe({
      next: (data) => this.leagues.set(data),
      error: (err) => this.error.set(this.readError(err)),
    });
  }

  // Regla de fechas: inicio <= fin. Las fechas "aaaa-mm-dd" se pueden comparar como texto.
  datesInvalid(): boolean {
    return this.form.startDate > this.form.endDate;
  }

  save(): void {
    this.error.set('');
    const request: Observable<unknown> = this.editing()
      ? this.leagueService.update(this.form.id, this.form)
      : this.leagueService.create(this.form);

    request.subscribe({
      next: () => {
        this.cancel();
        this.load();
      },
      error: (err) => this.error.set(this.readError(err)),
    });
  }

  edit(league: League): void {
    this.form = { ...league };
    this.editing.set(true);
  }

  remove(league: League): void {
    if (!confirm(`¿Borrar la liga ${league.name}? También se quitarán sus inscripciones.`)) return;
    this.leagueService.delete(league.id).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(this.readError(err)),
    });
  }

  cancel(): void {
    this.form = this.emptyLeague();
    this.editing.set(false);
  }

  private emptyLeague(): League {
    const today = new Date().toLocaleDateString('en-CA'); // formato aaaa-mm-dd
    return { id: 0, name: '', country: '', startDate: today, endDate: today, enabled: true };
  }

  private readError(err: HttpErrorResponse): string {
    if (err.status === 0) return 'No se pudo conectar con la API. ¿Está corriendo?';
    if (err.error?.errors) return (Object.values(err.error.errors) as string[][]).flat().join(' ');
    if (typeof err.error === 'string') return err.error;
    return 'Ocurrió un error inesperado.';
  }
}
