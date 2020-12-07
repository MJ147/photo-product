import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from './../../services/image.service';
import { ImageWrapper } from './../../models/image-wrapper';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-load-images',
	templateUrl: './load-images.component.html',
	styleUrls: ['./load-images.component.less'],
})
export class LoadImagesComponent implements OnInit {
	images$: Observable<ImageWrapper[]>;

	constructor(private _imageService: ImageService, public sanitizer: DomSanitizer) {}

	ngOnInit(): void {
		this.images$ = this._imageService.getImages();
	}

	addImage(file: File): void {
		this._imageService.saveImage(file);
	}
}
