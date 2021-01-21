import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer/customer.service';
import { AnalyticsService } from '../../services/analytics/analytics.service';

@Component({
  selector: 'mini-cart',
  templateUrl: './mini-cart.component.html',
  styleUrls: ['./mini-cart.component.scss']
})
export class MiniCartComponent implements OnInit {

  get items() { return this.customerService.cart; }

  constructor(
    private customerService: CustomerService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
  }

  openCart() {
    this.customerService.showCartModal();
    this.analyticsService.showCart();
  }
}
