import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatPaginatorModule,
    MatStepperModule,
    MatChipsModule
  ],
  templateUrl: './orders-page.html',
  styleUrls: ['./orders-page.css']
})
export class OrdersPageComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedTab = 0;
  
  // Pagination
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  currentPage = 0;
  totalItems = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.cartService.getClientOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filterOrders();
      },
      error: () => {
        this.orders = [];
        this.filterOrders();
      }
    });
  }
  
  filterOrders(event: any = null) {
    if (event) {
      this.selectedTab = event.index;
    }
    
    let orders = this.orders;
    switch(this.selectedTab) {
      case 1: // Processing
        orders = this.orders.filter(o => o.status === 'processing');
        break;
      case 2: // Shipped
        orders = this.orders.filter(o => o.status === 'shipped');
        break;
      case 3: // Delivered
        orders = this.orders.filter(o => o.status === 'delivered');
        break;
      case 4: // Cancelled
        orders = this.orders.filter(o => o.status === 'cancelled');
        break;
    }
    this.filteredOrders = orders;
    this.totalItems = this.filteredOrders.length;
    this.currentPage = 0;
  }
  
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getPaginatedOrders() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredOrders.slice(startIndex, endIndex);
  }

  getStepperIndex(order: any): number {
    if (order.status === 'delivered') return 2;
    if (order.status === 'shipped') return 1;
    return 0;
  }
} 