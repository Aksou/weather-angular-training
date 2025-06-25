import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LocalStorageService } from 'app/local-storage.service';

@Component({
  selector: 'app-cache-timeout-entry',
  templateUrl: './cache-timeout-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CacheTimeoutEntryComponent {

  constructor(private service : LocalStorageService) { }

  updateCacheTimeout(timeout : number){
    this.service.updateCacheTimeout(timeout);
  }

}
