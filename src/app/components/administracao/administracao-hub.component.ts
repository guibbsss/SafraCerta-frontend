import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-administracao-hub',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './administracao-hub.component.html',
  styleUrls: ['./administracao-hub.component.css']
})
export class AdministracaoHubComponent {}
