import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeamService } from '../../services/team-service';
import { Team } from '../../models/team';

@Component({
  imports: [FormsModule],
  selector: 'app-teams',
  styleUrl: './teams.css',
  templateUrl: './teams.html',
})
export class Teams implements OnInit {
  private teamService = inject(TeamService);

  teams = signal<Team[]>([]);   // lista que se muestra en la tabla
  editing = signal(false);      // ¿estamos editando o creando?
  error = signal('');           // mensaje de error para mostrar
  form: Team = this.emptyTeam(); // datos del formulario

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.teamService.getAll().subscribe({
      next: (data) => this.teams.set(data),
      error: (err) => this.error.set(this.readError(err)),
    });
  }

  save(): void {
    this.error.set('');
    const request: Observable<unknown> = this.editing()
      ? this.teamService.update(this.form.id, this.form)
      : this.teamService.create(this.form);

    request.subscribe({
      next: () => {
        this.cancel();
        this.load();
      },
      error: (err) => this.error.set(this.readError(err)),
    });
  }

  edit(team: Team): void {
    this.form = { ...team };   // copia, para no modificar la tabla mientras escribes
    this.editing.set(true);
  }

  remove(team: Team): void {
    if (!confirm(`¿Borrar el equipo ${team.name}?`)) return;
    this.teamService.delete(team.id).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(this.readError(err)),
    });
  }

  cancel(): void {
    this.form = this.emptyTeam();
    this.editing.set(false);
  }

  private emptyTeam(): Team {
    return { id: 0, name: '', country: '', playersQuantity: 11, enabled: true };
  }

  // Convierte la respuesta de error de la API en un texto legible
  private readError(err: HttpErrorResponse): string {
    if (err.status === 0) return 'No se pudo conectar con la API. ¿Está corriendo?';
    if (err.error?.errors) return (Object.values(err.error.errors) as string[][]).flat().join(' ');
    if (typeof err.error === 'string') return err.error;
    return 'Ocurrió un error inesperado.';
  }
}
