import { ChangeDetectionStrategy, Component, input, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent {
  public id = input<string>();
  public title = input<string>();
  public display: WritableSignal<boolean> = signal<boolean>(false);
}