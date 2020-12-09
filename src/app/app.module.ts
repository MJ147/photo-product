import { MaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadImagesComponent } from './components/load-images/load-images.component';

@NgModule({
	declarations: [AppComponent, MainComponent, LoadImagesComponent],
	imports: [BrowserModule, AppRoutingModule, MaterialModule, BrowserAnimationsModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
