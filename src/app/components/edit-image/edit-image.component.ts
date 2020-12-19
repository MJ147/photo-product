import { Coordinate } from './../../models/image-wrapper';
import { ImageService } from './../../services/image.service';
import { Component, OnInit } from '@angular/core';
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
	p5: p5;
	context;
	canvas;
	viewPortStyles = this.getViewportStyles();

	constructor(private _imageService: ImageService, public sanitizer: DomSanitizer) {}

	ngOnInit(): void {
		this.setImages();
		setTimeout(() => {
			this.createCanvas();
			this.drawImage();
			this.viewPortStyles = this.getViewportStyles();
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
				this.context = this.canvas.createCanvas(4000, 3000);
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
				this.setOneKindImageSize(image);
				this.setImageScale(image);
				image.position.x = index * image.size.x;
				image.position.y = (this.canvas.height - image.size.y) / 2;
				this.setImageCopies(image);
			});
		};
	}

	private setImageScale(image: ImageWrapper): void {
		let scale = this.canvas.width / this.images.length / image.img.width;
		if (this.canvas.height < image.img.height * scale) {
			scale = this.canvas.height / image.img.height;
		}
		image.scale = scale;
	}

	private setOneKindImageSize(image: ImageWrapper) {
		image.size.x = this.canvas.width / this.images.length;
		image.size.y = ((image.img.height * image.scale) / image.copies.columns) * image.copies.rows;
	}

	private setImageCopies(image: ImageWrapper) {
		for (let r = 0; r < image.copies.rows; r++) {
			const oneRowHeight = image.size.y / image.copies.rows;
			const y = image.position.y + r * oneRowHeight;
			for (let c = 0; c < image.copies.columns; c++) {
				const oneRowWidth = image.size.x / image.copies.columns;
				const x = image.position.x + c * oneRowWidth + (oneRowWidth - (image.img.width / image.copies.columns) * image.scale) / 2;
				this.canvas.image(
					image.img,
					x,
					y,
					(image.img.width * image.scale) / image.copies.columns,
					(image.img.height * image.scale) / image.copies.columns,
				);
			}
		}
	}

	saveImage() {
		this.p5.saveCanvas(this.context, 'myCanvas', 'png');
	}

	getViewportStyles() {
		const mainHeight: number = document.body.clientHeight;
		const mainWidth: number = document.body.clientWidth;
		const scale = (mainHeight / this.canvas?.height) * 0.8;
		const moveX = (mainWidth - this.canvas?.width * scale) * 0.5;

		return { transform: `scale(${scale})`, left: `${moveX}px` };
	}
}
