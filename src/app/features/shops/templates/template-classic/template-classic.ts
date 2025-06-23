import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-template-classic',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterModule],
  templateUrl: './template-classic.html',
  styleUrl: './template-classic.css'
})
export class TemplateClassicComponent {
  @Input() shop: any;
  @Input() products: any[] = [];
} 