import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
 
import { AppComponent } from './app.component';
import { ZoomModule } from '../lib/zoom';
 
@NgModule({
  imports: [
    BrowserModule,
    ZoomModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }