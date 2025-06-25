import { LocalStorageService } from './local-storage.service';
import { LocationService } from './location.service';
import {effect, Injectable, Signal, signal, untracked} from '@angular/core';
import { Observable, throwError } from 'rxjs';


import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { catchError } from 'rxjs/operators';

const CONDITIONS: string = "conditions";
const FORECASTS: string = "forecasts";

@Injectable()
export class WeatherService {

  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(
    private readonly http: HttpClient, 
    private readonly locationService: LocationService,
    private readonly localStorageService: LocalStorageService) {

    effect(_ => {
      const conditions = untracked(this.currentConditions);
      const locations = locationService.getCurrentLocations()();
      this.onLocationsUpdate(conditions, locations);
    },
    {
      allowSignalWrites: true,
    });
   }

  private onLocationsUpdate(conditions: ConditionsAndZip[], locations: string[]): void {
    // Add missing conditions according to locations cache
    locations.forEach(currLoc => {
      if (!conditions.some(cond => cond.zip === currLoc)) {
        this.addCurrentConditions(currLoc);
      }
    })

    // Remove conditions which are not in locations cache
    conditions.forEach(condition => {
      if (!locations.includes(condition.zip)) {
        this.removeCurrentConditions(condition.zip);
      }
    })
  }

  public addCurrentConditions(zipcode: string): void {
    const src$ = this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`).pipe(
      catchError(error => {
        console.error(`Error fetching conditions for zip: ${zipcode}, removing of associated location ongoing`);
        this.locationService.removeLocation(zipcode);
        return throwError(() => error);
      })
    );
    this.localStorageService.getData<CurrentConditions>(zipcode.concat(CONDITIONS), src$).subscribe((data) => this.updateCurrentCondtions(zipcode, data))
  }

  public updateCurrentCondtions(zipcode: string, data: CurrentConditions) {
    this.currentConditions.update(conditions => [...conditions, {zip: zipcode, data}])
  }

  public removeCurrentConditions(zipcode: string) {
    this.localStorageService.remove(zipcode);
    this.currentConditions.update(conditions => conditions.filter(condition => condition.zip !== zipcode));
  }

  public getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  public getForecast(zipcode: string): Observable<Forecast> {
    const src$ = this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);
    return this.localStorageService.getData<Forecast>(zipcode.concat(FORECASTS), src$);
  }

  public getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }

}
