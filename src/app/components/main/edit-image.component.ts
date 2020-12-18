import { ImageService } from './../../services/image.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as p5 from 'p5';
import { ImageWrapper } from 'src/app/models/image-wrapper';

@Component({
	selector: 'app-edit-image',
	templateUrl: './edit-image.component.html',
	styleUrls: ['./edit-image.component.less'],
})
export class EditImageComponent implements OnInit {
	images: ImageWrapper[] = [];
	isBorder: boolean = true;
	p5;
	context;
	startX = 0;
	x = 0;
	canvas;

	constructor(private _imageService: ImageService, private _elementRef: ElementRef, public sanitizer: DomSanitizer) {}

	ngOnInit(): void {
		this.setImages();
		setTimeout(() => {
			this.createCanvas();
			this.drawImage();
		}, 1);
	}

	private setImages() {
		this._imageService.getImages().subscribe((images) => {
			this.images = images;
		});
	}

	private createCanvas() {
		const p = (canvas) => {
			this.canvas = canvas;
			this.canvas.setup = () => {
				this.context = this.canvas.createCanvas(700, 410);
				this.canvas.background(255);
				this.images.forEach((image: ImageWrapper) => {
					image.img = this.canvas.loadImage(image.url);
				});
			};
		};
		this.p5 = new p5(p, 'viewport');
	}

	drawImage() {
		this.p5.draw = () => {
			this.images.forEach((image, index) => {
				this.setImageScale(image);
				const oneImageWidth = this.canvas.width / this.images.length;
				image.x = index * oneImageWidth + (oneImageWidth - image.img.width * image.scale) / 2;
				image.y = (this.canvas.height - image.img.height * image.scale) / 2;
				for (let i = 0; i < image.rows; i++) {
					const oneRowWidth = oneImageWidth / image.rows;
					image.x = image.x + i * oneRowWidth + (oneRowWidth - (image.img.width / image.rows) * image.scale) / 2;
					image.y = image.y;
					this.canvas.image(
						image.img,
						image.x,
						image.y,
						(image.img.width * image.scale) / image.rows,
						(image.img.height * image.scale) / image.rows,
					);
				}
			});
		};
	}

	saveImage() {
		this.p5.saveCanvas(this.context, 'myCanvas', 'png');
	}

	private setImageScale(image: ImageWrapper): void {
		let scale = this.canvas.width / this.images.length / image.img.width;
		if (this.canvas.height < image.img.height * scale) {
			scale = this.canvas.height / image.img.height;
		}
		image.scale = scale;
	}
}
