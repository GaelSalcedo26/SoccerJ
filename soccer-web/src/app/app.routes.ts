import { Routes } from '@angular/router';
import { Teams } from './pages/teams/teams';
import { Leagues } from './pages/leagues/leagues';
import { LeagueDetail } from './pages/league-detail/league-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'teams', pathMatch: 'full' },
  { path: 'teams', component: Teams },
  { path: 'leagues', component: Leagues },
  { path: 'leagues/:id', component: LeagueDetail },
];
