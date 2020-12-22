import { SafeUrl } from '@angular/platform-browser';

export interface ImageWrapper {
	id: number;
	url: SafeUrl;
	scale: number;
	copies: Copies;
	position: Coordinate;
	move: Coordinate;
	size?: Coordinate;
	img?: HTMLImageElement;
}

export interface Copies {
	columns: number;
	rows: number;
}

export interface Coordinate {
	x: number;
	y: number;
}
