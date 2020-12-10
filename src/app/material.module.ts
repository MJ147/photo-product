import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
	imports: [CommonModule],
	exports: [MatInputModule, MatButtonModule, MatIconModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatGridListModule],
})
export class MaterialModule {}
