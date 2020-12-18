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
				const oneKindImagesWidth = this.canvas.width / this.images.length;
				const oneKindImagesHeight = ((image.img.height * image.scale) / image.columns) * image.rows;
				image.x = index * oneKindImagesWidth;
				image.y = (this.canvas.height - oneKindImagesHeight) / 2;
				for (let r = 0; r < image.rows; r++) {
					const oneRowHeight = oneKindImagesHeight / image.rows;
					const y = image.y + r * oneRowHeight;
					for (let c = 0; c < image.columns; c++) {
						const oneRowWidth = oneKindImagesWidth / image.columns;
						const x = image.x + c * oneRowWidth + (oneRowWidth - (image.img.width / image.columns) * image.scale) / 2;
						this.canvas.image(
							image.img,
							x,
							y,
							(image.img.width * image.scale) / image.columns,
							(image.img.height * image.scale) / image.columns,
						);
					}
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
