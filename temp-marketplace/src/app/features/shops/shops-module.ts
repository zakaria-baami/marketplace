import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopsRoutingModule } from './shops-routing-module';
import { ShopProfileComponent } from './shop-create/shop-create';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ShopsRoutingModule,
    ShopProfileComponent
  ]
})
export class ShopsModule { }
