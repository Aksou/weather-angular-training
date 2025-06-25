import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {Router} from "@angular/router";
import {ConditionsAndZip} from '../conditions-and-zip.type';
import { WeatherService } from 'app/weather.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrl: './current-conditions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentConditionsComponent {

  protected weatherService = inject(WeatherService);
  private router = inject(Router);
  
  protected location = input<ConditionsAndZip>()
  
  protected showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }
}
