import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Place } from '../models/place.model';

@Injectable({ providedIn: 'root' })
export class PlaceService {

  private readonly mockUrl = 'assets/mock-data/places.json';

  constructor(private http: HttpClient) {}

  loadPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(this.mockUrl);
  }

  getPlaceById(id: number): Observable<Place | undefined> {
    return this.loadPlaces().pipe(
      map(places => places.find(place => place._id === id))
    );
  }

  postPlace(place: Place): Observable<Place> {
    return of(place);
  }

  updatePlace(id: number, data: Partial<Place>): Observable<Place | undefined> {
    return this.loadPlaces().pipe(
      map(places => {
        const place = places.find(place => place._id === id);

        if (!place) {
          return undefined;
        }

        return {
          ...place,
          ...data
        };
      })
    );
  }

  deletePlace(id: number): Observable<{ success: boolean; message: string }> {
    return of({
      success: true,
      message: `Place ${id} deleted (mock)`
    });
  }
}