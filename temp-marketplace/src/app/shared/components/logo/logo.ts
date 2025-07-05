import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="logo-container">
      <span class="logo-icon">
        <svg width="56" height="56" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="storefront-gradient" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
              <stop stop-color="#ff9800"/>
              <stop offset="1" stop-color="#ec4899"/>
            </linearGradient>
          </defs>
          <!-- Storefront base -->
          <rect x="7" y="15" width="24" height="14" rx="2" fill="url(#storefront-gradient)"/>
          <!-- Roof -->
          <rect x="5" y="10" width="28" height="7" rx="2" fill="#fff" stroke="url(#storefront-gradient)" stroke-width="2"/>
          <!-- Door -->
          <rect x="17" y="22" width="4" height="7" rx="1" fill="#fff"/>
          <!-- Windows -->
          <rect x="10" y="19" width="3" height="4" rx="1" fill="#fff"/>
          <rect x="25" y="19" width="3" height="4" rx="1" fill="#fff"/>
        </svg>
      </span>
      <span class="logo-text">
        <span class="main-text">MOGHRABI</span>
        <span class="subtitle">Marketplace</span>
      </span>
    </div>
  `,
  styles: [`
    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 56px;
      width: 56px;
    }
    .logo-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 1;
    }
    .main-text {
      font-size: 1.5rem;
      font-weight: 800;
      background: linear-gradient(90deg, #ff9800, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
      letter-spacing: 0.08em;
    }
    .subtitle {
      font-size: 0.95rem;
      font-weight: 500;
      color: #6b7280; /* Calm gray-blue */
      letter-spacing: 0.04em;
      margin-top: 0.18rem;
    }
  `]
})
export class LogoComponent {} 