import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { permissaoGuard } from './guards/permissao.guard';
import { P } from './constants/permissoes';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { FazendaListComponent } from './components/fazenda/fazenda-list/fazenda-list.component';
import { TalhaoListComponent } from './components/talhao/talhao-list/talhao-list.component';
import { SafraListComponent } from './components/safra/safra-list/safra-list.component';
import { AtividadeListComponent } from './components/atividade/atividade-list/atividade-list.component';
import { EstoqueShellComponent } from './components/estoque/estoque-shell.component';
import { EstoqueHubComponent } from './components/estoque/estoque-hub.component';
import { EstoqueAtualComponent } from './components/estoque/estoque-atual/estoque-atual.component';
import { EstoqueMovimentacaoComponent } from './components/estoque/estoque-movimentacao/estoque-movimentacao.component';
import { FinanceiroListComponent } from './components/financeiro/financeiro-list/financeiro-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdministracaoShellComponent } from './components/administracao/administracao-shell.component';
import { AdministracaoHubComponent } from './components/administracao/administracao-hub.component';
import { AdministracaoPerfisComponent } from './components/administracao/administracao-perfis.component';
import { AdministracaoPermissoesComponent } from './components/administracao/administracao-permissoes.component';
import { AdministracaoSolicitacoesComponent } from './components/administracao/administracao-solicitacoes.component';

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
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [permissaoGuard],
        data: { permissaoId: P.VER_DASHBOARD }
      },
      {
        path: 'fazendas',
        component: FazendaListComponent,
        canActivate: [permissaoGuard],
        data: { permissaoId: P.VER_FAZENDA }
      },
      {
        path: 'talhoes',
        component: TalhaoListComponent,
        canActivate: [permissaoGuard],
        data: { permissaoId: P.VER_TALHAO }
      },
      {
        path: 'safras',
        component: SafraListComponent,
        canActivate: [permissaoGuard],
        data: { permissaoId: P.VER_SAFRA }
      },
      {
        path: 'atividades',
        component: AtividadeListComponent,
        canActivate: [permissaoGuard],
        data: { permissaoId: P.VER_ATIVIDADES }
      },
      {
        path: 'estoque',
        component: EstoqueShellComponent,
        canActivate: [permissaoGuard],
        data: { permissaoId: P.VER_ESTOQUE },
        children: [
          { path: '', component: EstoqueHubComponent },
          { path: 'atual', component: EstoqueAtualComponent },
          {
            path: 'entradas',
            component: EstoqueMovimentacaoComponent,
            data: { tipo: 'ENTRADA' }
          },
          {
            path: 'saidas',
            component: EstoqueMovimentacaoComponent,
            data: { tipo: 'SAIDA' }
          }
        ]
      },
      {
        path: 'financeiro',
        component: FinanceiroListComponent,
        canActivate: [permissaoGuard],
        data: { permissaoId: P.VER_FINANCEIRO }
      },
      {
        path: 'administracao',
        component: AdministracaoShellComponent,
        canActivate: [permissaoGuard],
        data: { permissaoId: P.VER_ADMINISTRACAO },
        children: [
          { path: '', component: AdministracaoHubComponent },
          { path: 'perfis', component: AdministracaoPerfisComponent },
          { path: 'permissoes', component: AdministracaoPermissoesComponent },
          { path: 'solicitacoes', component: AdministracaoSolicitacoesComponent }
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
