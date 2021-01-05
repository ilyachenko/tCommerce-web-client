import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { ProductListItemDto } from '../shared/dtos/product-list-item.dto';
import { ProductService } from '../pages/product/services/product.service';
import { SortingPaginatingFilterDto } from '../shared/dtos/spf.dto';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { NgUnsubscribe } from '../shared/directives/ng-unsubscribe.directive';
import { fromEvent } from 'rxjs';
import { DeviceService } from '../services/device-detector/device.service';
import { onWindowLoad } from '../shared/helpers/on-window-load.function';

@Component({
  selector: 'products-preview',
  templateUrl: './products-preview.component.html',
  styleUrls: ['./products-preview.component.scss']
})
export class ProductsPreviewComponent extends NgUnsubscribe implements OnInit, AfterViewInit {

  isLoading: boolean = false;
  isArrowVisible: boolean;
  private itemWidth: number;
  private activeItemIdx: number = 0;

  @Input() itemsToShow: number;
  @Input() items: ProductListItemDto[] = [];
  @Input() ids: number[];
  @Input() type: string;
  @Input() parentNameForAnalytics: string;
  @ViewChild('itemsContainerRef') itemsContainerRef: ElementRef;
  @ViewChildren('itemRef') itemRef: QueryList<ElementRef>;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private device: DeviceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setItemsToShow(this.type);
    this.setIsArrowVisible();
  }

  ngAfterViewInit(): void {
    if (this.ids) {
      onWindowLoad(this, this.fetchItems);
    } else if (this.items) {
      this.handleResize();
    }
  }

  private fetchItems() {
    if (!this.ids?.length || !this.device.isPlatformBrowser()) { return; }

    const spf = new SortingPaginatingFilterDto();
    spf.id = this.ids;

    this.isLoading = true;
    this.cdr.detectChanges();
    this.productService.fetchProductsByFilters(spf)
      .pipe( finalize(() => this.isLoading = false) )
      .subscribe(
        response => {
          this.setItems(response.data);
          this.handleResize();
          this.setIsArrowVisible();
        }
      );
  }

  prev() {
    if (this.activeItemIdx === 0) {
      this.activeItemIdx = this.items.length - this.itemsToShow;
    } else if (this.activeItemIdx < this.itemsToShow) {
      this.activeItemIdx = 0;
    } else {
      this.activeItemIdx -= this.itemsToShow;
    }

    this.setOffset();
  }

  next() {
    const nextIdx = this.activeItemIdx + this.itemsToShow;

    if (nextIdx > this.items.length - 1) {
      this.activeItemIdx = 0;
    } else if (nextIdx > this.items.length - this.itemsToShow) {
      this.activeItemIdx = this.items.length - this.itemsToShow;
    } else {
      this.activeItemIdx = nextIdx;
    }

    this.setOffset();
  }

  private setItems(items: ProductListItemDto[]) {
    this.items = items.sort((a, b) => {
      const indexOfA = this.ids.indexOf(a.productId);
      const indexOfB = this.ids.indexOf(b.productId);

      if (indexOfA > indexOfB) {
        return 1;
      } else if (indexOfA < indexOfB) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  private handleResize() {
    if (this.device.isPlatformServer()) { return; }

    this.cdr.detectChanges();
    this.setSizes();

    fromEvent(window, 'resize')
      .pipe( debounceTime(500), takeUntil(this.ngUnsubscribe) )
      .subscribe(() => this.setSizes());
  }

  private setSizes() {
    const containerWidth = this.itemsContainerRef.nativeElement.parentElement.clientWidth;

    this.itemWidth = containerWidth / this.itemsToShow;

    this.itemRef.forEach(itemRef => itemRef.nativeElement.style.width = `${this.itemWidth}px`);
  }

  private setOffset() {
    const x = this.activeItemIdx * this.itemWidth;
    this.itemsContainerRef.nativeElement.style.transform = `translate3d(-${x}px, 0, 0)`;
    this.cdr.detectChanges();
  }

  setItemsToShow(type: any) {
    if (!type) {
      this.itemsToShow = this.device.isMobile() ? 2 : 4;
    } else {
      this.itemsToShow = this.device.isDesktop() ? 5 : 2;
    }
  }

  setIsArrowVisible() {
    this.isArrowVisible = this.items.length > this.itemsToShow;
  }
}
