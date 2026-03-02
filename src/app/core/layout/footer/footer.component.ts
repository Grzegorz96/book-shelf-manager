import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { LogoComponent } from '@shared/logo';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, LucideAngularModule, LogoComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();
}
