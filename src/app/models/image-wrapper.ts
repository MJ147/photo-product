import { SafeUrl } from '@angular/platform-browser';

export interface ImageWrapper {
	img?: HTMLImageElement;
	url: SafeUrl;
	scale: number;
	columns: number;
	rows: number;
	x: number; // x coordinate
	y: number; // y coordinate
}
