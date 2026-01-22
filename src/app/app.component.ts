import { Component } from '@angular/core';
import { MainComponent } from './layout/main';
import { HeaderComponent } from './layout/header';
import { FooterComponent } from './layout/footer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [MainComponent, HeaderComponent, FooterComponent],
})
export class AppComponent {}
