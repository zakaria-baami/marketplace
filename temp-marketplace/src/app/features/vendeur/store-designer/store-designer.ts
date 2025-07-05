import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { TemplateClassicComponent } from '../../shops/templates/template-classic/template-classic';
import { TemplateModernComponent } from '../../shops/templates/template-modern/template-modern';
import { TemplateMinimalistComponent } from '../../shops/templates/template-minimalist/template-minimalist';
import { TemplateBoldComponent } from '../../shops/templates/template-bold/template-bold';

@Component({
  selector: 'app-store-designer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    TemplateClassicComponent,
    TemplateModernComponent,
    TemplateMinimalistComponent,
    TemplateBoldComponent
  ],
  templateUrl: './store-designer.html',
  styleUrl: './store-designer.css'
})
export class StoreDesignerComponent {
  form: FormGroup;
  templates = [
    { id: 'classic', name: 'Artisan', component: TemplateClassicComponent },
    { id: 'modern', name: 'Galleria', component: TemplateModernComponent },
    { id: 'minimalist', name: 'Boutique', component: TemplateMinimalistComponent },
    { id: 'bold', name: 'Vogue', component: TemplateBoldComponent }
  ];
  selectedTemplate = 'classic';
  logoPreview: string | ArrayBuffer | null = null;
  bannerPreview: string | ArrayBuffer | null = null;

  // Mock products for preview
  mockProducts = [
    { id: '1', name: 'Collier Feuille d\'Argent', price: '45.00', imageUrl: '', category: 'Colliers' },
    { id: '2', name: 'Bracelet en Pierre de Lune', price: '35.50', imageUrl: '', category: 'Bracelets' },
    { id: '3', name: 'Boucles d\'oreilles Plume', price: '28.00', imageUrl: '', category: 'Boucles d\'oreilles' },
    { id: '4', name: 'Bague Branche Enchantée', price: '52.00', imageUrl: '', category: 'Bagues' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['Ma Boutique'],
      tagline: ['Des créations uniques pour tous les goûts'],
      description: ['Bienvenue dans ma boutique ! Découvrez mes créations artisanales.'],
      logo: [null],
      banner: [null],
      template: ['classic'],
      categories: [['Colliers', 'Bracelets', 'Boucles d\'oreilles', 'Bagues']]
    });
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.logoPreview = reader.result;
      reader.readAsDataURL(file);
      this.form.patchValue({ logo: file });
    }
  }

  onBannerChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.bannerPreview = reader.result;
      reader.readAsDataURL(file);
      this.form.patchValue({ banner: file });
    }
  }

  onTemplateChange(templateId: string) {
    this.selectedTemplate = templateId;
    this.form.patchValue({ template: templateId });
  }

  save() {
    // TODO: Send form data to backend
    alert('Modifications enregistrées ! (Simulation)');
  }
} 