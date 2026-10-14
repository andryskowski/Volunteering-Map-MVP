import { Component } from '@angular/core';
import { MapComponent } from '../map/map';
import { LegendComponent } from '../legend/legend';

@Component({
  selector: 'app-main-page',
  imports: [MapComponent, LegendComponent],
  templateUrl: './main-page.html',
  styleUrls: ['./main-page.scss'],
})
export class MainPage {}
