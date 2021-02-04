import { Injectable } from '@angular/core';
import {
  Resolve,
  // ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SearchService } from 'app/services/search.service';
// import { TableTemplateUtils } from 'app/shared/components/table-template/table-template-utils';

@Injectable()
export class NewsResolver implements Resolve<Observable<object>> {
  constructor(
    private searchService: SearchService,
    // private tableTemplateUtils: TableTemplateUtils
  ) { }

  resolve(): Observable<object> {
    // let tableParams = this.tableTemplateUtils.getNavParamsObj();
    // if (tableParams.sortBy === '-datePosted') {
    //   tableParams.sortBy = '-dateAdded';
    // }
    return this.searchService.getSearchResults(
      '',
      'RecentActivity',
      [],
      0,
      0,
      '',
      {},
      true,
      '');
  }
}
