import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from './../../services/image.service';
import { ImageWrapper, Copies } from './../../models/image-wrapper';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-load-images',
	templateUrl: './load-images.component.html',
	styleUrls: ['./load-images.component.less'],
})
export class LoadImagesComponent implements OnInit {
	images: ImageWrapper[];
	selectedImage: ImageWrapper = null;

	propertiesForm = new FormGroup({
		columns: new FormControl(''),
		rows: new FormControl(''),
	});

	constructor(private _imageService: ImageService, private _router: Router, public sanitizer: DomSanitizer) {}

	ngOnInit(): void {
		this.setImages();
		this.setSelectedImageProperties();
	}

	private setImages() {
		this._imageService.getImages().subscribe((images) => {
			this.images = images;
		});
	}

	private setSelectedImageProperties() {
		this.propertiesForm.valueChanges.subscribe((copies: Copies) => {
			if (this.selectedImage.copies.rows !== copies.rows && copies.rows > 0) {
				this.selectedImage.copies.rows = copies.rows;
			}

			if (this.selectedImage.copies.columns !== copies.columns && copies.columns > 0) {
				this.selectedImage.copies.columns = copies.columns;
			}
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
			const copies: Copies = { columns: this.selectedImage?.copies.columns, rows: this.selectedImage?.copies.rows };
			this.propertiesForm.patchValue(copies);
		}
	}

	array(number: number): any[] {
		return Array(number);
	}
}
