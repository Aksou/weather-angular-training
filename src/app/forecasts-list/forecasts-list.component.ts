import { ChangeDetectionStrategy, Component, effect, input, signal, WritableSignal } from '@angular/core';
import {WeatherService} from '../weather.service';
import {Forecast} from './forecast.type';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForecastsListComponent {

  public zipcode = input<string>();
  protected forecast: WritableSignal<Forecast> = signal<Forecast>(undefined);

  constructor(protected weatherService: WeatherService) {
    effect(_ => {
      if (this.zipcode()) {
        this.weatherService.getForecast(this.zipcode())
          .subscribe(data => this.forecast.set(data));
      }
    },
  {
    allowSignalWrites: true
  })
  }
}
