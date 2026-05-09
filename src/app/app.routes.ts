import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { FazendaListComponent } from './components/fazenda/fazenda-list/fazenda-list.component';
import { TalhaoListComponent } from './components/talhao/talhao-list/talhao-list.component';
import { SafraListComponent } from './components/safra/safra-list/safra-list.component';
import { AtividadeListComponent } from './components/atividade/atividade-list/atividade-list.component';
import { EstoqueListComponent } from './components/estoque/estoque-list/estoque-list.component';
import { FinanceiroListComponent } from './components/financeiro/financeiro-list/financeiro-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'fazendas', component: FazendaListComponent },
      { path: 'talhoes', component: TalhaoListComponent },
      { path: 'safras', component: SafraListComponent },
      { path: 'atividades', component: AtividadeListComponent },
      { path: 'estoque', component: EstoqueListComponent },
      { path: 'financeiro', component: FinanceiroListComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
