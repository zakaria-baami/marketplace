import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs/operators';

import { ProductService } from '../../../../core/services/product';
import { Category, CategoryService } from '../../../../core/services/category';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  isLoading = false;
  pageTitle = 'Add New Product';
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.required],
      prix: [null, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categorie_id: [null, Validators.required],
      images: this.fb.array([this.fb.control('')])
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.pageTitle = 'Edit Product';
      this.loadProductData();
    }
  }

  get imagesFormArray(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  addImageField(): void {
    this.imagesFormArray.push(this.fb.control(''));
  }

  removeImageField(index: number): void {
    this.imagesFormArray.removeAt(index);
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories({
      actives_uniquement: true,
      format: 'liste'
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

  loadProductData(): void {
    if (!this.productId) return;
    this.isLoading = true;
    this.productService.getProductById(this.productId).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const product = response.data;
          this.productForm.patchValue({
            nom: product.nom,
            description: product.description,
            prix: product.prix,
            stock: product.stock,
            categorie_id: product.categorie?.id
          });

          if (product.images && product.images.length > 0) {
            const imageControls = product.images.map((img: any) => this.fb.control(img.url));
            this.productForm.setControl('images', this.fb.array(imageControls));
          }
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement du produit:', error);
        this.snackBar.open('Erreur lors du chargement du produit', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.snackBar.open('Please fill all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const formData = this.productForm.value;
    
    formData.images = formData.images.filter((img: string) => img && img.trim() !== '');

    const operation = this.isEditMode && this.productId
      ? this.productService.updateProduct(this.productId, formData)
      : this.productService.createProduct(formData);

    operation.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.snackBar.open(`Product ${this.isEditMode ? 'updated' : 'created'} successfully!`, 'Close', { duration: 3000 });
        this.router.navigate(['/vendeur/products']);
      },
      error: (err) => {
        this.snackBar.open('An error occurred. Please try again.', 'Close', { duration: 3000, panelClass: ['bg-red-500', 'text-white'] });
        console.error(err);
      }
    });
  }
} 