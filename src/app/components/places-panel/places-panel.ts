import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceService } from '../../services/place-service';
import { Place } from '../../models/place.model';
import { EntityPanelComponent, DeletableEntity } from '../entity-panel/entity-panel';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { ModalService } from '../../services/modal-service';
import { EditEntityFormComponent } from '../edit-entity-form/edit-entity-form';
import { ToastComponent } from '../toast/toast';

@Component({
  selector: 'app-places-panel',
  standalone: true,
  imports: [CommonModule, EntityPanelComponent, ToastComponent],
  template: `
    <app-toast #toast></app-toast>
    <app-entity-panel
      [title]="'Places'"
      [entities]="placesForPanel"
      [columns]="['name', 'city', 'street', 'category', 'district']"
      [deleteFn]="deletePlaceFn"
      [editFn]="editPlaceFn"
      [loading$]="loading$"
    >
    </app-entity-panel>
  `,
})
export class PlacesPanel implements OnInit {
  places: Place[] = [];
  placesForPanel: DeletableEntity[] = [];
  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  @ViewChild('toast') toast!: ToastComponent;

  constructor(
    private placeService: PlaceService,
    private modalService: ModalService,
  ) {}

  ngOnInit() {
    this.fetchPlaces();
  }

  fetchPlaces() {
    this.loadingSubject.next(true);
    this.placeService
      .loadPlaces()
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (places) => {
          this.places = places.map((p) => ({ ...p, _id: Number(p._id) }));
          this.placesForPanel = this.places;
        },
        error: (err) => {
          console.error(err);
          this.places = [];
          this.placesForPanel = [];
          this.toast.show('Failed to load places', 'error');
        },
      });
  }

  deletePlaceFn = (id: string | number) => {
    return this.placeService.deletePlace(Number(id)).pipe(
      tap((res) => {
        if (res.success) {
          this.places = this.places.filter((p) => Number(p._id) !== Number(id));
          this.placesForPanel = this.places;
          this.toast.show(res.message || 'Place deleted', 'success');
        } else {
          this.toast.show(res.message || 'Failed to delete place', 'error');
        }
      }),
    );
  };

  editPlaceFn = (place: Place) => {
    this.modalService.open('Edit Place', EditEntityFormComponent, {
      entity: place,
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'city', label: 'City' },
        { name: 'street', label: 'Street' },
        { name: 'houseNo', label: 'House No' },
        { name: 'postalCode', label: 'Postal Code' },
        { name: 'category', label: 'Category' },
        { name: 'district', label: 'District' },
        { name: 'shortDescription', label: 'Short Description', type: 'textarea' },
      ],
      submitFn: (updatedPlace: any) =>
        this.placeService.updatePlace(place._id, updatedPlace).pipe(
          tap((updated) => {
            if (!updated) {
              this.toast.show('Place not found', 'error');
              return;
            }

            this.places = this.places.map((p) =>
              Number(p._id) === Number(updated._id)
                ? { ...p, ...updated, _id: Number(updated._id) }
                : p,
            );
            this.placesForPanel = this.places;
            this.toast.show('Place updated successfully', 'success');
          }),
        ),
    });
  };
}
