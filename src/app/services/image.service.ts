import { Injectable } from '@angular/core';
import { BehaviorSubject, observable, Observable } from 'rxjs';
import { ImageWrapper } from '../models/image-wrapper';

@Injectable({
	providedIn: 'root',
})
export class ImageService {
	private images: ImageWrapper[] = [];
	private images$ = new BehaviorSubject<ImageWrapper[]>([]);

	constructor() {}

	saveImage(file: File): void {
		const unsafeImageUrl = URL.createObjectURL(file);
		const image: ImageWrapper = {
			url: unsafeImageUrl,
			scale: 100,
			copies: { columns: 1, rows: 1 },
			position: { x: 0, y: 0 },
		};

		this.images.push(image);
		this.images$.next(this.images);
	}

	getImages(): Observable<ImageWrapper[]> {
		return this.images$.asObservable();
	}
}
