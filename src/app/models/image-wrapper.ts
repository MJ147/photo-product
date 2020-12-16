import { SafeUrl } from '@angular/platform-browser';

export interface ImageWrapper {
	img?: HTMLImageElement;
	url: SafeUrl;
	scale: number;
	columns: number;
	rows: number;
}
