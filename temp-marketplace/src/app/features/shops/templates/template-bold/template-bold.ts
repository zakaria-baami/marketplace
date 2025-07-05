import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-template-bold',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './template-bold.html',
  styleUrl: './template-bold.css'
})
export class TemplateBoldComponent {
  @Input() shop: any;
  @Input() products: any[] = [];
} 