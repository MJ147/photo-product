import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.less'],
})
export class MainComponent implements OnInit {
	images: Image[] = [];
	isBorder: boolean = true;

	constructor(private sanitizer: DomSanitizer) {}

	ngOnInit(): void {}

	addImage(files: File[]): void {
		const unsafeImageUrl = URL.createObjectURL(files[0]);
		const image: Image = {
			img: this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl),
			scale: 100,
			numberOfCopies: 1,
			margin: 0,
		};
		this.images.push(image);
	}
}
