import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

const LOCATIONS : string = "locations";

@Injectable()
export class LocationService {
  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
  private readonly locations : WritableSignal<string[]> = signal([]);

  constructor() {
    let locationsState = this.localStorageService.get<string[] | undefined>(LOCATIONS);
    if (locationsState) {
      this.locations.set(locationsState.data ?? []);
    }
  }

  addLocation(zipcode : string) {
    this.locations.update(currentLocations => currentLocations.concat([zipcode]));
    this.localStorageService.set(LOCATIONS, this.locations())
  }

  removeLocation(zipcode : string) {
    this.locations.update(currentLocations => currentLocations.filter(loc => loc !== zipcode));
    this.localStorageService.set(LOCATIONS, this.locations())
  }

  getCurrentLocations(): Signal<string[]> {
    return this.locations.asReadonly();
  }
}
