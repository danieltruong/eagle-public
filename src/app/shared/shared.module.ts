import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { MatProgressBarModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material';
import { NgxTextOverflowClampModule } from 'ngx-text-overflow-clamp';

import { OrderByPipe } from 'app/shared/pipes/order-by.pipe';
import { NewlinesPipe } from 'app/shared/pipes/newlines.pipe';
import { ObjectFilterPipe } from 'app/shared/pipes/object-filter.pipe';

import { VarDirective } from 'app/shared/utils/ng-var.directive';
import { DragMoveDirective } from 'app/shared/utils/drag-move.directive';

import { ListConverterPipe } from './pipes/list-converter.pipe';
import { SafeHtmlPipe } from './pipes/safe-html-converter.pipe';
import { OrgNamePipe } from './pipes/org-name.pipe';
import { PublishedPipe } from 'app/shared/pipes/published.pipe';
import { Utils } from './utils/utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableTemplateComponent } from './components/table-template/table-template.component';
import { PageSizePickerComponent } from './components/page-size-picker/page-size-picker.component';
import { PageCountDisplayComponent } from './components/page-count-display/page-count-display.component';
import { InjectComponentService } from './services/inject-component.service';
import { TableRowDirective } from './components/table-template/table-row.directive';
import { TableTemplateUtils } from './components/table-template/table-template-utils';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    NgSelectModule,
    MatProgressBarModule,
    MatSnackBarModule,
    NgxTextOverflowClampModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    RouterModule,
    NgbModule,
    NgxPaginationModule
  ],
  declarations: [
    OrderByPipe,
    NewlinesPipe,
    ObjectFilterPipe,
    PublishedPipe,
    VarDirective,
    DragMoveDirective,
    ListConverterPipe,
    SafeHtmlPipe,
    OrgNamePipe,

    TableTemplateComponent,
    TableRowDirective,
    PageSizePickerComponent,
    PageCountDisplayComponent
  ],
  exports: [
    BrowserModule,
    MatProgressBarModule,
    MatSnackBarModule,
    NgxTextOverflowClampModule,
    OrderByPipe,
    NewlinesPipe,
    ObjectFilterPipe,
    PublishedPipe,
    VarDirective,
    DragMoveDirective,
    ListConverterPipe,
    SafeHtmlPipe,
    OrgNamePipe,

    TableTemplateComponent,
    TableRowDirective,
    PageSizePickerComponent,
    PageCountDisplayComponent
  ],
  providers: [
    TableTemplateUtils,
    InjectComponentService,
    Utils,
    { provide: NZ_I18N, useValue: en_US }
  ]
})

export class SharedModule { }
