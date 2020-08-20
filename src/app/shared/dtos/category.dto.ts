import { MetaTagsDto } from './meta-tags.dto';
import { BreadcrumbDto } from './breadcrumb.dto';
import { MediaDto } from './media.dto';

export class CategoryDto {
  description: string;
  id: number;
  metaTags: MetaTagsDto;
  name: string;
  parentId: number;
  slug: string;
  breadcrumbs: BreadcrumbDto[];
  medias: MediaDto[];
}
