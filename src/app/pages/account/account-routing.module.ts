import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from './account.component';
import { AccountCustomerInfoComponent } from './customer-info/account-customer-info.component';
import { AccountOrdersComponent } from './account-orders/account-orders.component';
import { AddressesComponent } from './addresses/addresses.component';
import { AccountDiscountComponent } from './account-discount/account-discount.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: '', pathMatch: 'full', component: AccountCustomerInfoComponent, data: { label: 'global.contacts' } },
      { path: 'orders', component: AccountOrdersComponent, data: { label: 'global.my_orders' } },
      // { path: 'wishlist', component: WishlistComponent, data: { label: 'global.my_wishes' } },
      { path: 'addresses', component: AddressesComponent, data: { label: 'global.shipment_address' } },
      // { path: 'reviews', component: AccountReviewsComponent, data: { label: 'account_reviews.my_reviews' } },
      { path: 'discount', component: AccountDiscountComponent, data: { label: 'global.my_discounts' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
