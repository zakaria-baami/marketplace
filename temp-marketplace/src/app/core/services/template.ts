import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  constructor(private http: HttpClient) {}

  getTemplates(): Observable<any[]> {
    return this.http.get<any>('/api/templates').pipe(
      map(response => Array.isArray(response) ? response : response.data)
    );
  }

  updateBoutiqueTemplate(boutiqueId: number, templateId: number) {
    return this.http.put(`/api/boutiques/${boutiqueId}/template`, { template_id: templateId });
  }
} 