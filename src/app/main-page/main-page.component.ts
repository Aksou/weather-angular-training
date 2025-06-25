import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LocationService } from 'app/location.service';
import { WeatherService } from 'app/weather.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent {
  protected weatherService = inject(WeatherService);
  protected locationService = inject(LocationService);

  protected handleTabCloseFn = (tabId: string): void => {
    this.locationService.removeLocation(tabId)
  }
}
