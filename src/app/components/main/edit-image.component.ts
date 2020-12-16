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
	canvas;
	startX = 0;
	x = 0;

	constructor(
		private _imageService: ImageService,
		private _elementRef: ElementRef,
		private _changeDetectorRef: ChangeDetectorRef,
		public sanitizer: DomSanitizer,
	) {}

	ngOnInit(): void {
		this.setImages();
		setTimeout(() => {
			this.createImage();
		}, 1);
	}

	private setImages() {
		this._imageService.getImages().subscribe((images) => {
			this.images = images;
		});
	}

	private createImage() {
		const viewport = this._elementRef.nativeElement.querySelector('viewport');
		const p = (p) => {
			p.setup = () => {
				this.canvas = p.createCanvas(700, 410);
				p.background(255);
				this.images.forEach((image: ImageWrapper) => {
					image.img = p.loadImage(image.url);
				});
			};
			p.draw = () => {
				this.images.forEach((image) => {
					const scale = 300 / image.img.height;
					p.scale(scale);
					p.image(image.img, this.x, 0);
					p.scale(image.img.height / 300);
				});
			};

			p.mousePressed = () => {
				p.saveCanvas(this.canvas, 'myCanvas', 'png');
				this.startX = p.mouseX;
				console.log('pressed');
			};

			p.mouseDragged = () => {
				this.x = (p.mouseX * this.images[0].img.height) / 300;
			};
		};

		let canvas = new p5(p, viewport);
	}
}
