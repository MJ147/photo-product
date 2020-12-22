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
			this.images.forEach((image) => {
				image.position.x = image.id * image.size.x + image.move.x / this.viewportScale;
				image.position.y = (this.canvas.height - image.size.y) / 2 + image.move.y / this.viewportScale;
				this.setOneKindImageSize(image);
				this.setImageScale(image);
				this.setImageCopies(image);
			});

			if (this.selectedImage != null) {
				this.canvas.fill(0, 0, 0, 0);
				this.canvas.strokeWeight(5);
				this.canvas.rect(
					this.selectedImage.position.x,
					this.selectedImage.position.y,
					this.selectedImage.size.x,
					this.selectedImage.size.y,
				);
			}
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
		let index;

		this.p5.mousePressed = () => {
			this.images.some((image, i) => {
				if (this.isPointImage(image)) {
					index = i;
					this.selectedImage = image;
					startX = this.p5.mouseX - this.selectedImage.move.x;
					startY = this.p5.mouseY - this.selectedImage.move.y;
					return;
				}
			});
			if (index !== this.images.length) {
				this.images.splice(index, 1);
				this.images.push(this.selectedImage);
			}
		};

		this.p5.mouseReleased = () => {
			this.selectedImage = null;
		};

		this.p5.mouseDragged = () => {
			this.selectedImage.move.x = this.p5.mouseX - startX;
			this.selectedImage.move.y = this.p5.mouseY - startY;
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
