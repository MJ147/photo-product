import { MainComponent } from './components/main/main.component';
import { LoadImagesComponent } from './components/load-images/load-images.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{ path: '', component: LoadImagesComponent },
	{ path: 'create', component: MainComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
