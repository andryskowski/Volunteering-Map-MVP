import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  tileLayer,
  latLng,
  MapOptions,
  marker,
  icon,
  Map,
  Marker,
} from 'leaflet';
import { PlaceService } from '../../services/place-service';
import { Place } from '../../models/place.model';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { loadPlaces } from '../../store/places/places.actions';
import { selectAllPlaces } from '../../store/places/places.selectors';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  template: `
    <div
      leaflet
      [leafletOptions]="options"
      (leafletMapReady)="onMapReady($event)"
      style="height: 100vh;"
    ></div>
  `,
})
export class MapComponent implements OnInit, OnDestroy {
  pin1 = 'assets/gps1.svg';
  pin2 = 'assets/gps2.svg';
  pin3 = 'assets/gps3.svg';
  pin4 = 'assets/gps4.svg';
  pin5 = 'assets/gps5.svg';
  pin6 = 'assets/gps6.svg';

  options: MapOptions = {
    center: latLng(51.7686, 19.4565),
    zoom: 14,
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }),
    ],
  };

  places$!: Observable<Place[]>;

  private store = inject(Store);
  private destroy$ = new Subject<void>();

  constructor(private placeService: PlaceService) {}

  ngOnInit(): void {
    this.store.dispatch(loadPlaces());
    this.places$ = this.store.select(selectAllPlaces);
  }

  getIconByCategory(category: string) {
    let iconUrl = this.pin6;

    switch (category) {
      case 'children':
        iconUrl = this.pin1;
        break;
      case 'animals':
        iconUrl = this.pin2;
        break;
      case 'invalids':
        iconUrl = this.pin3;
        break;
      case 'addictions':
        iconUrl = this.pin4;
        break;
      case 'retirees':
        iconUrl = this.pin5;
        break;
    }

    return icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }

  onMapReady(map: Map): void {
    this.places$
      .pipe(takeUntil(this.destroy$))
      .subscribe((places) => {
        places.forEach((p) => {
          if (p.lat == null || p.lng == null) {
            return;
          }

          const m = marker([p.lat, p.lng], {
            icon: this.getIconByCategory(p.category),
          });

          m.bindPopup(this.createPopupContent(p));

          m.addTo(map);
        });
      });
  }

  private createPopupContent(place: Place): HTMLElement {
    const container = document.createElement('div');
    container.style.textAlign = 'center';

    const image = document.createElement('img');
    image.src = place.img;
    image.alt = place.name;
    image.style.maxWidth = '100px';

    const name = document.createElement('div');
    const nameStrong = document.createElement('b');
    nameStrong.textContent = place.name;
    name.appendChild(nameStrong);

    const address = document.createElement('div');
    address.textContent = `${place.street} ${place.houseNo}`;

    const city = document.createElement('div');
    city.textContent = place.city;

    const link = document.createElement('a');
    link.href = `/place/${encodeURIComponent(place._id)}`;
    link.textContent = 'Details';

    container.appendChild(image);
    container.appendChild(name);
    container.appendChild(address);
    container.appendChild(city);
    container.appendChild(link);

    return container;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}