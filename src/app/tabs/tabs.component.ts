import { ChangeDetectionStrategy, Component, contentChildren, input, effect } from '@angular/core';
import { TabComponent } from 'app/tab/tab.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  protected tabs = contentChildren<TabComponent>(TabComponent);
  public handleTabCloseFn = input<(tabId: string)=> void>();
  
  constructor() {
    // Auto select one tab if no one is active
    effect(_ => {
      if (this.tabs().length > 0 && this.tabs().every(tab => !tab.display())) {
        this.tabs()[0].display.set(true);
      }
    },
    {
      allowSignalWrites: true
    });
  }

  public updateActiveTab(tabId: string) {
    this.tabs().forEach(tab => tab.display.set(tab.id() === tabId));
  }
}