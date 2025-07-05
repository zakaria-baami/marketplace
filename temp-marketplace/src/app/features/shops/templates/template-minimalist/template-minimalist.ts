import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-template-minimalist',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './template-minimalist.html',
  styleUrl: './template-minimalist.css'
})
export class TemplateMinimalistComponent {
  @Input() shop: any;
  @Input() products: any[] = [];
} 