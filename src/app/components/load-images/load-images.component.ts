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

	columns: FormControl = new FormControl('');
	rows: FormControl = new FormControl('');

	constructor(private _imageService: ImageService, private _router: Router, public sanitizer: DomSanitizer) {}

	ngOnInit(): void {
		this._imageService.getImages().subscribe((images) => {
			this.images = images;
		});
		this.columns.valueChanges.subscribe((columns) => {
			this.selectedImage.columns = columns;
		});
		this.rows.valueChanges.subscribe((rows) => {
			this.selectedImage.rows = rows;
		});
	}

	addImage(file: File): void {
		this._imageService.saveImage(file);
	}

	createImage(): void {
		this._router.navigate(['edit']);
	}

	selectImage(image: ImageWrapper): void {
		this.selectedImage = image;
		if (image !== null) {
			this.columns.setValue(image?.columns);
			this.rows.setValue(image?.rows);
		}
	}

	array(number: number): any[] {
		return Array(number);
	}
}
