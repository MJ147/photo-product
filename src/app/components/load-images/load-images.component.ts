import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from './../../services/image.service';
import { ImageWrapper } from './../../models/image-wrapper';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-load-images',
	templateUrl: './load-images.component.html',
	styleUrls: ['./load-images.component.less'],
})
export class LoadImagesComponent implements OnInit {
	images: ImageWrapper[];
	selectedImage: ImageWrapper = null;

	columns: FormControl = new FormControl(1);
	rows: FormControl = new FormControl(1);

	constructor(private _imageService: ImageService, private _router: Router, public sanitizer: DomSanitizer) {}

	ngOnInit(): void {
		this._imageService.getImages().subscribe((images) => {
			this.images = images;
		});
	}

	addImage(file: File): void {
		this._imageService.saveImage(file);
	}

	createImage(): void {
		this._router.navigate(['create']);
	}

	selectImage(image: ImageWrapper): void {
		this.selectedImage = image;
	}
}
