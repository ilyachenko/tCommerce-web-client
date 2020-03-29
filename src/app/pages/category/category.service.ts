import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseDto } from '../../shared/dtos/response.dto';
import { CategoryDto } from '../../shared/dtos/category.dto';
import { CategoryTreeItem } from '../../shared/dtos/category-tree.dto';
import { ProductListItemDto } from '../../shared/dtos/product-list-item.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: CategoryTreeItem[];

  constructor(private http: HttpClient) {
    this.setCategories();
  }

  setCategories() {
    this.http.get<ResponseDto<CategoryTreeItem[]>>(`http://173.249.23.253:3080/api/v1/categories/tree`)
      .subscribe(
        response => {
          this.categories = response.data;
        }
      );
  }

  fetchCategory(slug: string) {
    return this.http.get<ResponseDto<CategoryDto>>(`http://173.249.23.253:3080/api/v1/categories/${slug}`);
  }
}
