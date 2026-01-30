import { Component } from '@angular/core';
import { MainComponent, HeaderComponent, FooterComponent } from '@core/layout';
import { ErrorModalComponent } from '@shared/error-modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [MainComponent, HeaderComponent, FooterComponent, ErrorModalComponent],
})
export class AppComponent {}
