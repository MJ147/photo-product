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
	selectedImage: ImageWrapper = null;
	selectedImageBorder: number = 5;
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
		this.setListeners();
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
				image.position.x = image.id * image.size.x + image.offset.x / this.viewportScale;
				image.position.y = (this.canvas.height - image.size.y) / 2 + image.offset.y / this.viewportScale;
				this.setOneKindImageSize(image);
				this.setImageScale(image);
				this.setImageCopies(image);
			});

			if (this.selectedImage !== null) {
				this.canvas.fill(0, 0, 0, 0);
				this.canvas.stroke(0, 0, 0, 150);
				this.canvas.strokeWeight(this.selectedImageBorder);
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

	setListeners() {
		let startX;
		let startY;
		let index;
		let isSelectedImageBorderPointedX;
		let isSelectedImageBorderPointedY;

		this.p5.mousePressed = () => {
			if (this.selectedImage) {
				isSelectedImageBorderPointedX = this.isImageBorderPointed(
					this.selectedImage,
					this.selectedImageBorder,
					this.selectedImageBorder,
					'y',
				);
				isSelectedImageBorderPointedY = this.isImageBorderPointed(
					this.selectedImage,
					this.selectedImageBorder,
					this.selectedImageBorder,
					'x',
				);
				if (isSelectedImageBorderPointedX || isSelectedImageBorderPointedY) {
					startX = this.p5.mouseX;
					startY = this.p5.mouseY;
					return;
				}
			}

			const isImageClicked = this.images.reverse().some((image, i) => {
				if (this.isImagePointed(image)) {
					index = i;
					this.selectedImage = image;
					startX = this.p5.mouseX - this.selectedImage.offset.x;
					startY = this.p5.mouseY - this.selectedImage.offset.y;
					this.images.splice(index, 1);
					this.images.push(this.selectedImage);
					return true;
				}
			});
			if (!isImageClicked) {
				this.selectedImage = null;
			}
		};

		this.p5.mouseDragged = () => {
			if (this.selectedImage !== null) {
				if (isSelectedImageBorderPointedX) {
					this.selectedImage.scaleCorrection = 1 + (startX - this.p5.mouseX) * 0.001;
					return;
				}
				if (isSelectedImageBorderPointedY) {
					this.selectedImage.scaleCorrection = 1 + (startY - this.p5.mouseY) * 0.001;
					return;
				}

				this.selectedImage.offset.x = this.p5.mouseX - startX;
				this.selectedImage.offset.y = this.p5.mouseY - startY;
			}
		};
		this.p5.mouseMoved = () => this.setCursor();
	}

	setCursor() {
		const isAnyImagePointed = this.images.some((image) => this.isImagePointed(image));
		const isSelectedImageBorderPointedX = this.isImageBorderPointed(
			this.selectedImage,
			this.selectedImageBorder,
			this.selectedImageBorder,
			'x',
		);
		const isSelectedImageBorderPointedY = this.isImageBorderPointed(
			this.selectedImage,
			this.selectedImageBorder,
			this.selectedImageBorder,
			'y',
		);
		if (isSelectedImageBorderPointedX) {
			this.canvas.cursor('ns-resize');
			return;
		}
		if (isSelectedImageBorderPointedY) {
			this.canvas.cursor('ew-resize');
			return;
		}
		if (isAnyImagePointed) {
			this.canvas.cursor('grab');
			return;
		}
		this.canvas.cursor('default');
	}

	private isImagePointed(image: ImageWrapper, offset: number = 0, offsetDirection?: string): boolean {
		let offsetX = offset;
		let offsetY = offset;
		if (offsetDirection !== 'x') {
			offsetY = 0;
		}
		if (offsetDirection !== 'y') {
			offsetX = 0;
		}
		const isImageInsidePointedX =
			this.p5.mouseX >= -offsetX + image?.position.x * this.viewportScale &&
			this.p5.mouseX < offsetX + (image?.position.x + image?.size.x) * this.viewportScale;
		const isImageInsidePointedY =
			this.p5.mouseY >= -offsetY + image?.position.y * this.viewportScale &&
			this.p5.mouseY < offsetY + (image?.position.y + image?.size.y) * this.viewportScale;

		return isImageInsidePointedX && isImageInsidePointedY;
	}

	private isImageBorderPointed(
		image: ImageWrapper,
		offsetOutside: number = 1,
		offsetInside: number = offsetOutside,
		offsetDirection: string,
	): boolean {
		return this.isImagePointed(image, offsetOutside, offsetDirection) && !this.isImagePointed(image, -offsetInside, offsetDirection);
	}

	private setImageScale(image: ImageWrapper): void {
		let scale = this.canvas.width / this.images.length / image.img.width;
		if (this.canvas.height < image.img.height * scale) {
			scale = this.canvas.height / image.img.height;
		}
		image.scale = scale * image.scaleCorrection;
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
