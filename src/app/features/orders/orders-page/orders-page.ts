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
import { HeaderComponent } from '../../../shared/components/header/header';

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
    MatChipsModule,
    HeaderComponent
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

  constructor() {}

  ngOnInit() {
    this.loadOrders();
    this.filterOrders();
  }

  loadOrders() {
    // Mock orders data - replace with API call
    this.orders = [
      {
        id: 'ORD-001',
        date: '2024-01-15',
        status: 'delivered',
        statusText: 'Livrée',
        total: 89.99,
        seller: 'Marie Créations',
        trackingNumber: 'TRK123456789',
        estimatedDelivery: '2024-01-18',
        items: [
          { id: 1, name: 'Collier artisanal en argent', quantity: 1, price: 45.99, image: 'assets/images/product1.jpg' },
          { id: 2, name: 'Vase en céramique fait main', quantity: 1, price: 44.00, image: 'assets/images/product2.jpg' }
        ],
        statusHistory: [
          { status: 'processed', date: '2024-01-15', completed: true },
          { status: 'shipped', date: '2024-01-16', completed: true },
          { status: 'delivered', date: '2024-01-18', completed: true }
        ]
      },
      {
        id: 'ORD-002',
        date: '2024-01-10',
        status: 'shipped',
        statusText: 'Expédiée',
        total: 156.50,
        seller: 'Vintage Style',
        trackingNumber: 'TRK987654321',
        estimatedDelivery: '2024-01-13',
        items: [
          { id: 3, name: 'Sac en cuir vintage', quantity: 1, price: 89.99, image: 'assets/images/product3.jpg' },
          { id: 4, name: 'Tableau aquarelle original', quantity: 1, price: 66.51, image: 'assets/images/product4.jpg' }
        ],
        statusHistory: [
          { status: 'processed', date: '2024-01-10', completed: true },
          { status: 'shipped', date: '2024-01-11', completed: true },
          { status: 'delivered', date: '2024-01-13', completed: false }
        ]
      },
      {
        id: 'ORD-003',
        date: '2024-01-05',
        status: 'processing',
        statusText: 'En cours',
        total: 35.00,
        seller: 'PersonalizedGifts',
        trackingNumber: null,
        estimatedDelivery: '2024-01-12',
        items: [
          { id: 5, name: 'Bracelet personnalisé', quantity: 1, price: 35.00, image: 'assets/images/product5.jpg' }
        ],
        statusHistory: [
          { status: 'processed', date: '2024-01-05', completed: true },
          { status: 'shipped', date: '2024-01-06', completed: false },
          { status: 'delivered', date: '2024-01-12', completed: false }
        ]
      }
    ];
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