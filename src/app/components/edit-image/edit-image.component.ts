import { ImageWrapper } from './../../models/image-wrapper';
import { ImageService } from './../../services/image.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as p5 from 'p5';

@Component({
	selector: 'app-edit-image',
	templateUrl: './edit-image.component.html',
	styleUrls: ['./edit-image.component.less'],
})
export class EditImageComponent implements OnInit {
	images: ImageWrapper[] = [];
	selectedImage: ImageWrapper;
	p5: p5;
	context;
	canvas;
	viewportScale: number;

	constructor(private _imageService: ImageService, public sanitizer: DomSanitizer) {}

	ngOnInit(): void {
		this.setImages();
		this.createCanvas();
		this.drawImage();
		this.getViewportScale();
		this.clickImage();
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
				this.images.forEach((image: ImageWrapper) => {
					image.img = this.canvas.loadImage(image.url);
				});
			};
		};
		this.p5 = new p5(p, 'viewport');
	}

	drawImage() {
		this.p5.draw = () => {
			this.canvas.background(255);
			this.images.forEach((image, index) => {
				image.position.x = index * image.size.x + image.move.x / this.viewportScale;
				image.position.y = (this.canvas.height - image.size.y) / 2 + image.move.y / this.viewportScale;
				this.setOneKindImageSize(image);
				this.setImageScale(image);
				this.setImageCopies(image);
			});
		};
	}

	private setImageCopies(image: ImageWrapper) {
		for (let r = 0; r < image.copies.rows; r++) {
			const oneRowHeight = image.size.y / image.copies.rows;
			for (let c = 0; c < image.copies.columns; c++) {
				const oneRowWidth = image.size.x / image.copies.columns;
				const x = image.position.x + c * oneRowWidth + (oneRowWidth - (image.img.width / image.copies.columns) * image.scale) / 2;
				this.canvas.image(
					image.img,
					x,
					image.position.y + r * oneRowHeight,
					(image.img.width * image.scale) / image.copies.columns,
					(image.img.height * image.scale) / image.copies.columns,
				);
			}
		}
	}

	clickImage() {
		let startX;
		let startY;
		this.p5.mousePressed = () => {
			console.log(1);

			this.images.forEach((image) => {
				if (this.isPointImage(image)) {
					this.selectedImage = image;
					startX = this.p5.mouseX - this.selectedImage.move.x;
					startY = this.p5.mouseY - this.selectedImage.move.y;
				}
			});
		};

		this.p5.mouseDragged = () => {
			console.log(2);
			this.selectedImage.move.x = -startX + this.p5.mouseX;
			this.selectedImage.move.y = -startY + this.p5.mouseY;
		};
	}

	private isPointImage(image: ImageWrapper): boolean {
		const isPointImageX =
			this.p5.mouseX >= image.position.x * this.viewportScale &&
			this.p5.mouseX < (image.position.x + image.size.x) * this.viewportScale;
		const isPointImageY =
			this.p5.mouseY >= image.position.y * this.viewportScale &&
			this.p5.mouseY < (image.position.y + image.size.y) * this.viewportScale;

		return isPointImageX && isPointImageY;
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

	saveImage() {
		this.p5.saveCanvas(this.context, 'myCanvas', 'png');
	}

	getViewportScale(): number {
		const mainHeight: number = document.body.clientHeight;
		this.viewportScale = (mainHeight / this.canvas?.height) * 0.8;
		return (mainHeight / this.canvas?.height) * 0.8;
	}

	getViewportMove() {
		const mainWidth: number = document.body.clientWidth;
		return (mainWidth - this.canvas?.width * this.viewportScale) * 0.5;
	}
}
