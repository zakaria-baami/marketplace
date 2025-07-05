import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-template-modern',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './template-modern.html',
  styleUrl: './template-modern.css'
})
export class TemplateModernComponent {
  @Input() shop: any;
  @Input() products: any[] = [];
} 