import { EditImageComponent } from './components/main/edit-image.component';
import { LoadImagesComponent } from './components/load-images/load-images.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{ path: '', component: LoadImagesComponent },
	{ path: 'edit', component: EditImageComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
