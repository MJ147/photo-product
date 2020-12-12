import { Component, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as p5 from 'p5';

interface Image {
	img: SafeUrl;
	scale: number;
	numberOfCopies: number;
	margin: number;
}

@Component({
	selector: 'app-edit-image',
	templateUrl: './edit-image.component.html',
	styleUrls: ['./edit-image.component.less'],
})
export class EditImageComponent implements OnInit {
	images: Image[] = [];
	isBorder: boolean = true;
	p5;
	canvas;
	x = 0;
	img = [];

	constructor(public sanitizer: DomSanitizer, private _elementRef: ElementRef) {}

	ngOnInit(): void {}

	addImage(event): void {
		const unsafeImageUrl = URL.createObjectURL(event.target.files[0]);
		const image: Image = {
			img: unsafeImageUrl,
			scale: 100,
			numberOfCopies: 1,
			margin: 0,
		};

		this.images.push(image);
	}

	createImage() {
		const viewport = this._elementRef.nativeElement.querySelector('viewport');
		const p = (p) => {
			p.setup = () => {
				p.createCanvas(700, 410);
				p.background(250);
				this.images.forEach((image) => {
					this.img.push(p.loadImage(image.img));
				});
			};
			p.draw = () => {
				this.img.forEach((image, index) => {
					const scale = 300 / image.height;
					p.scale(scale);
					p.image(image, index * 200, 0);
				});
			};
		};
		this.canvas = new p5(p, viewport);
	}
}
