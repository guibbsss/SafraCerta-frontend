import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse, User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('login: armazena token e usuário no localStorage e dispara currentUser$', (done) => {
    const credentials: LoginRequest = { email: 'joao@safra.com', password: 'senha123' };
    const fakeUser: User = {
      id: 7,
      email: 'joao@safra.com',
      nome: 'João',
      ativo: true,
      permissaoIds: [1, 2]
    };
    const response: LoginResponse = { token: 'tok-123', user: fakeUser };

    service.currentUser$.subscribe((user) => {
      if (user && user.id === 7) {
        expect(user.email).toBe('joao@safra.com');
        done();
      }
    });

    service.login(credentials).subscribe((resp) => {
      expect(resp.token).toBe('tok-123');
      expect(localStorage.getItem('token')).toBe('tok-123');
      const stored = JSON.parse(localStorage.getItem('currentUser') ?? '{}') as User;
      expect(stored.email).toBe('joao@safra.com');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(response);
  });

  it('logout: limpa token, currentUser e BehaviorSubject', () => {
    localStorage.setItem('token', 'tok-existente');
    localStorage.setItem(
      'currentUser',
      JSON.stringify({ id: 1, email: 'x@y.com', nome: 'X', permissaoIds: [] })
    );

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('isAuthenticated: retorna true quando há token e false quando não há', () => {
    expect(service.isAuthenticated()).toBeFalse();
    localStorage.setItem('token', 'abc');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('getCurrentUserId: devolve o id do usuário atual ou undefined', (done) => {
    const credentials: LoginRequest = { email: 'a@b.com', password: 'x' };
    const fakeUser: User = { id: 42, email: 'a@b.com', nome: 'A', ativo: true, permissaoIds: [] };

    expect(service.getCurrentUserId()).toBeUndefined();

    service.login(credentials).subscribe(() => {
      expect(service.getCurrentUserId()).toBe(42);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({ token: 'tok', user: fakeUser });
  });
});
