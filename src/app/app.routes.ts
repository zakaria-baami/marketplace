import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home page
  {
    path: '',
    loadComponent: () => import('./features/home/homepage/homepage').then(m => m.HomepageComponent)
  },
  
  // Authentication
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  
  // Products
  {
    path: 'products',
    loadChildren: () => import('./features/products/products-module').then(m => m.ProductsModule)
  },
  
  // Categories listing
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories-listing/categories-listing').then(m => m.CategoriesListingComponent)
  },
  
  // Category page
  {
    path: 'category/:categorySlug',
    loadComponent: () => import('./features/categories/category-page/category-page').then(m => m.CategoryPageComponent)
  },
  
  // Search
  {
    path: 'search',
    loadComponent: () => import('./features/search/search-page/search-page').then(m => m.SearchPageComponent)
  },
  
  // Favorites
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites-page/favorites-page').then(m => m.FavoritesPageComponent)
  },
  
  // Messages
  {
    path: 'messages',
    loadComponent: () => import('./features/messages/messages-page/messages-page').then(m => m.MessagesPageComponent)
  },
  
  // Orders
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/orders-page/orders-page').then(m => m.OrdersPageComponent)
  },
  
  // Shops
  {
    path: 'shops',
    loadChildren: () => import('./features/shops/shops-module').then(m => m.ShopsModule)
  },
  
  // Cart & Checkout
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart-module').then(m => m.CartModule)
  },
  
  // Client specific routes
  {
    path: 'client',
    loadChildren: () => import('./features/client/client-module').then(m => m.ClientModule)
  },
  
  // Vendeur specific routes
  {
    path: 'vendeur',
    loadChildren: () => import('./features/vendeur/vendeur-module').then(m => m.VendeurModule)
  },
  
  // Admin dashboard
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent)
  },
  
  // 404 redirect
  {
    path: '**',
    redirectTo: ''
  }
];