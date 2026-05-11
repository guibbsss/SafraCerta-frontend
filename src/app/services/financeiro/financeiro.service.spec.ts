import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { FinanceiroService } from './financeiro.service';
import { environment } from '../../../environments/environment';
import {
  FinanceiroFiltro,
  FinanceiroResumo,
  TransacaoFinanceira
} from '../../models/financeiro.model';

describe('FinanceiroService', () => {
  let service: FinanceiroService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/transacoes-financeiras`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FinanceiroService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(FinanceiroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('list: sem filtro envia GET para a URL base sem parâmetros', () => {
    const mockResp: TransacaoFinanceira[] = [];
    service.list().subscribe((r) => expect(r).toEqual(mockResp));
    const req = httpMock.expectOne((r) => r.url === baseUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);
    req.flush(mockResp);
  });

  it('list: monta HttpParams a partir de FinanceiroFiltro', () => {
    const filtro: FinanceiroFiltro = {
      fazendaId: 5,
      tipo: 'DESPESA',
      status: 'PAGO',
      dataInicio: '2025-01-01',
      dataFim: '2025-12-31'
    };
    service.list(filtro).subscribe();

    const req = httpMock.expectOne((r) => r.url === baseUrl);
    expect(req.request.params.get('fazendaId')).toBe('5');
    expect(req.request.params.get('tipo')).toBe('DESPESA');
    expect(req.request.params.get('status')).toBe('PAGO');
    expect(req.request.params.get('dataInicio')).toBe('2025-01-01');
    expect(req.request.params.get('dataFim')).toBe('2025-12-31');
    req.flush([]);
  });

  it('getResumo: chama /transacoes-financeiras/resumo', () => {
    const resumo: FinanceiroResumo = {
      totalReceitas: 100,
      totalDespesas: 30,
      saldo: 70,
      quantidadeReceitas: 1,
      quantidadeDespesas: 1,
      quantidadePendentes: 0,
      quantidadeAtrasadas: 0
    };
    service.getResumo().subscribe((r) => expect(r).toEqual(resumo));
    const req = httpMock.expectOne(`${baseUrl}/resumo`);
    expect(req.request.method).toBe('GET');
    req.flush(resumo);
  });

  it('delete: envia DELETE com body contendo a justificativa', () => {
    service.delete(42, 'Lançamento duplicado').subscribe();
    const req = httpMock.expectOne(`${baseUrl}/42`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual({ justificativa: 'Lançamento duplicado' });
    req.flush(null);
  });

  it('create: envia POST com o payload e devolve o registro criado', () => {
    const novo: TransacaoFinanceira = {
      fazendaId: 1,
      tipo: 'RECEITA',
      valor: 500,
      descricao: 'Venda',
      status: 'PAGO',
      dataTransacao: '2025-06-01'
    };
    const criado: TransacaoFinanceira = { id: 99, ...novo };

    service.create(novo).subscribe((r) => expect(r).toEqual(criado));
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(novo);
    req.flush(criado);
  });

  it('update: envia PUT para /transacoes-financeiras/{id}', () => {
    const atualizado: TransacaoFinanceira = {
      id: 12,
      fazendaId: 1,
      tipo: 'DESPESA',
      valor: 100,
      descricao: 'Insumo',
      status: 'PAGO',
      dataTransacao: '2025-06-15'
    };
    service.update(12, atualizado).subscribe();
    const req = httpMock.expectOne(`${baseUrl}/12`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(atualizado);
    req.flush(atualizado);
  });
});
