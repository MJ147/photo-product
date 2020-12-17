import { Properties } from './../../models/properties';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from './../../services/image.service';
import { ImageWrapper } from './../../models/image-wrapper';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

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
		this.propertiesForm.valueChanges.subscribe((properties: Properties) => {
			console.log(properties);

			if (this.selectedImage.rows !== properties.rows && properties.rows > 0) {
				this.selectedImage.rows = properties.rows;
			}

			if (this.selectedImage.columns !== properties.columns && properties.columns > 0) {
				this.selectedImage.columns = properties.columns;
			}
		});
	}

	get rowsControl(): AbstractControl {
		return this.propertiesForm.controls.rows;
	}
	get columnsControl(): AbstractControl {
		return this.propertiesForm.controls.columns;
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
			this.rowsControl.setValue(this.selectedImage?.rows);
			this.columnsControl.setValue(this.selectedImage?.columns);
		}
	}

	array(number: number): any[] {
		return Array(number);
	}
}
