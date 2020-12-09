import { SafeUrl } from '@angular/platform-browser';

export interface ImageWrapper {
	image?: HTMLImageElement;
	url: SafeUrl;
	scale: number;
	columns: number;
	rows: number;
}
