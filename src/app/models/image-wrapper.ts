import { SafeUrl } from '@angular/platform-browser';

export interface ImageWrapper {
	img?: HTMLImageElement;
	url: SafeUrl;
	scale: number;
	copies: Copies;
	position: Coordinate;
	dimension?: Coordinate;
}

export interface Copies {
	columns: number;
	rows: number;
}

export interface Coordinate {
	x: number;
	y: number;
}
