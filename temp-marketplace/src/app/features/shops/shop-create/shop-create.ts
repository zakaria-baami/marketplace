import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './shop-create.html',
  styleUrl: './shop-create.css'
})
export class ShopProfileComponent implements OnInit {
  shopForm: FormGroup;
  loading = false;
  templates = [
    { id: 1, nom: 'Artisan', description: 'Moderne', image: 'assets/images/template-artisan.png' },
    { id: 2, nom: 'Galleria', description: 'Classique', image: 'assets/images/template-galleria.png' },
    { id: 3, nom: 'Boutique', description: 'Minimaliste', image: 'assets/images/template-boutique.png' },
    { id: 4, nom: 'Vogue', description: 'Bold', image: 'assets/images/template-vogue.png' }
  ];
  selectedTemplateId: number = 1;
  boutique: any = null;
  showAddProductForm = false;
  products: any[] = [];
  salesDataByMonth = [
    { month: 'Janvier', revenue: 8500, orders: 89 },
    { month: 'Février', revenue: 7550, orders: 78 },
    { month: 'Mars', revenue: 9100, orders: 95 },
    { month: 'Avril', revenue: 10200, orders: 110 },
    { month: 'Mai', revenue: 9800, orders: 105 }
  ];
  newProduct = { name: '', price: null, stock: null, photo: '', description: '' };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.shopForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required]
    });
    // Récupérer l'ID du template sélectionné
    let templateId = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      templateId = localStorage.getItem('selectedTemplateId');
    }
    if (templateId) {
      this.selectedTemplateId = Number(templateId);
    }
  }

  ngOnInit() {
    // Récupérer la boutique du vendeur connecté (mock ou API réelle)
    this.http.get<any>('/api/boutiques/vendeur/me').subscribe({
      next: (res) => {
        this.boutique = res.boutique || null;
        if (this.boutique) {
          // Pré-remplir le formulaire avec les vraies données
          this.shopForm.patchValue({
            nom: this.boutique.nom || '',
            description: this.boutique.description || ''
          });
          // Charger les vrais produits de la boutique
          this.http.get<any>(`/api/vendeur/produits?boutique_id=${this.boutique.id}`).subscribe({
            next: (produitsRes) => {
              const produits = produitsRes.produits || produitsRes.data?.produits || [];
              this.products = produits.map((p: any) => ({
                id: p.id,
                name: p.nom,
                price: p.prix,
                stock: p.stock,
                photo: p.photo || '',
                description: p.description || ''
              }));
            },
            error: () => {
              this.products = [];
            }
          });
        }
      },
      error: () => {
        this.boutique = null;
      }
    });
  }

  onSubmit() {
    if (this.shopForm.valid && this.selectedTemplateId) {
      this.loading = true;
      const payload = {
        nom: this.shopForm.value.nom,
        description: this.shopForm.value.description,
        template_id: this.selectedTemplateId
      };
      this.http.post<any>('/api/boutiques', payload).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Boutique créée avec succès ! Redirection...', 'Fermer', { duration: 3000 });
          const boutiqueId = response?.boutique?.id || response?.data?.boutique?.id;
          setTimeout(() => {
            if (boutiqueId) {
              this.router.navigate(['/shop/boutique', boutiqueId.toString()]);
            } else {
              this.router.navigate(['/shops']); // fallback
            }
          }, 2000);
        },
        error: () => { this.loading = false; }
      });
    } else {
      this.shopForm.markAllAsTouched();
      this.snackBar.open('Veuillez remplir tous les champs', 'Fermer', { duration: 3000 });
    }
  }

  loadProducts() {
    // Mock produits, à remplacer par un appel API réel
    this.products = [
      { id: 1, name: 'Collier artisanal en argent', price: 45.99, stock: 15 },
      { id: 2, name: 'Bracelet personnalisé', price: 32.00, stock: 8 },
      { id: 3, name: 'Bague en or 18 carats', price: 299.99, stock: 3 }
    ];
  }

  addProduct() {
    if (this.newProduct.name && this.newProduct.price && this.newProduct.stock) {
      const newId = this.products.length ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
      this.products.push({ id: newId, ...this.newProduct });
      this.newProduct = { name: '', price: null, stock: null, photo: '', description: '' };
    }
  }

  deleteProduct(productId: number) {
    this.products = this.products.filter(p => p.id !== productId);
  }
} 