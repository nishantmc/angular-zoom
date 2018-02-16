import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoomDirective } from './zoom.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ZoomDirective
  ],
  exports: [
    ZoomDirective
  ]
})
export class ZoomModule { }