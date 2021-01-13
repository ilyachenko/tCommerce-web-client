import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../services/blog/blog.service';
import { HeadService } from '../../../services/head/head.service';
import { ActivatedRoute } from '@angular/router';
import { BlogCategoryDto } from '../../../shared/dtos/blog-category.dto';
import { IBreadcrumb } from '../../../breadcrumbs/breadcrumbs.interface';
import { LanguageService } from '../../../services/language/language.service';

@Component({
  selector: 'blog-category',
  templateUrl: './blog-category.component.html',
  styleUrls: ['./blog-category.component.scss', '../blog-page.scss']
})
export class BlogCategoryComponent implements OnInit {

  breadcrumbs: IBreadcrumb[];
  category: BlogCategoryDto;

  constructor(private blogService: BlogService,
              private route: ActivatedRoute,
              private headService: HeadService,
              private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.fetchCategory();
  }

  private fetchCategory() {
    const slug = this.route.snapshot.data.slug;
    this.blogService.getCategory(slug)
      .pipe()
      .subscribe(
        response => {
          this.category = response.data;
          this.setBreadcrumbs();
          this.setMeta();
        }
      );
  }

  private setBreadcrumbs() {
    this.languageService.getTranslation('global.blog').subscribe(text => {
      this.breadcrumbs = [{ title: text, link: 'blog' }, { title: this.category.name }];
    });
  }

  private setMeta() {
    this.headService.setMeta(this.category.metaTags);
  }
}
