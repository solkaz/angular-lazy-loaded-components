import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Address } from '../address';

@Component({
  selector: 'app-my-form',
  templateUrl: './my-form.component.html',
  styleUrls: ['./my-form.component.css'],
})
export class MyFormComponent {
  formGroup = this.fb.group({
    street: [, [Validators.required]],
    houseNumber: [, [Validators.required]],
    careOf: [],
    postalCode: [, [Validators.required, Validators.pattern(/^([0-9]{5})$/)]],
    city: [, [Validators.required]],
  });

  @Output() submitForm = new EventEmitter<Address>();
  @Output() clearData = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.formGroup.valid) {
      this.submitForm.emit(this.formGroup.value);
    }
  }

  clearForm() {
    this.formGroup.setValue({
      street: '',
      houseNumber: '',
      careOf: '',
      postalCode: '',
      city: '',
    });
  }
}

export { ReactiveFormsModule };

@NgModule({
  declarations: [MyFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
class MyFormModule {}
