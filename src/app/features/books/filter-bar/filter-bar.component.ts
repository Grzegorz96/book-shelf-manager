import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  imports: [FormsModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class FilterBarComponent {
  protected readonly filterOutput = output<string>();
  protected readonly filterForm = new FormGroup({
    bookByGenre: new FormControl(''),
  });

  protected applyFilter(): void {
    this.filterOutput.emit(this.filterForm.value.bookByGenre ?? '');
  }

  protected clearFilter(): void {
    this.filterForm.patchValue({ bookByGenre: '' });
    this.filterOutput.emit('');
  }
}
