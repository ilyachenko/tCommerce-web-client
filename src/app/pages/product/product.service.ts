import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseDto } from '../../shared/dtos/response.dto';
import { ProductDto } from '../../shared/dtos/product.dto';
import { toHttpParams } from '../../shared/helpers/to-http-params.function';
import { SortingPaginatingFilterDto } from '../../shared/dtos/spf.dto';
import { API_HOST, SEARCH_QUERY_PARAM, viewedProductsIdsKey } from '../../shared/constants';
import { ProductListResponseDto } from '../../shared/dtos/product-list-response.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  recentlyViewedProducts = viewedProductsIdsKey;
  maxViewedProductsArrLength = 30;

  constructor(private http: HttpClient) {
  }

  fetchProduct(slug: string) {
    return this.http.get<ResponseDto<ProductDto>>(`${API_HOST}/api/v1/products/${slug}`);
  }

  fetchProductsByAutocomplete(query: string) {
    const params = {
      [SEARCH_QUERY_PARAM]: query,
      autocomplete: 'true'
    };

    return this.http.get<ProductListResponseDto>(`${API_HOST}/api/v1/products`, { params });
  }

  fetchProductsByFilters(spf: SortingPaginatingFilterDto) {
    return this.http.get<ProductListResponseDto>(`${API_HOST}/api/v1/products`, { params: toHttpParams(spf) });
  }

  addViewedProductIdToLocalStorage(productId: number) {
    let recentlyViewedProducts: any[] = localStorage.getItem(this.recentlyViewedProducts)
      ? JSON.parse(localStorage.getItem(this.recentlyViewedProducts)) : [];

    if (recentlyViewedProducts.length >= this.maxViewedProductsArrLength) {
      recentlyViewedProducts.pop();
    }

    recentlyViewedProducts.unshift(productId);

    recentlyViewedProducts = [...new Set(recentlyViewedProducts)];
    localStorage.setItem(this.recentlyViewedProducts, JSON.stringify(recentlyViewedProducts));
  }

  getViewedProductsFromLocalStorage() {
    return JSON.parse(localStorage.getItem(this.recentlyViewedProducts));
  }


}
