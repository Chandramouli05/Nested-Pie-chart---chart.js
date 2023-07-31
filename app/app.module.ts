import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MultiChartComponent } from './multi-chart/multi-chart.component';


@NgModule({
  declarations: [
    AppComponent,
    MultiChartComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
