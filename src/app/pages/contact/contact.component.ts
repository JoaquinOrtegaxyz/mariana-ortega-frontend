import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-contact-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  whatsappNumber: string = '5492262579622';

  constructor(private fb: FormBuilder, private configService: ConfigService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.configService.getConfig().subscribe({
      next: (config) => {
        if (config?.whatsapp) {
          this.whatsappNumber = config.whatsapp.replace(/\D/g, '');
        }
      }
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const form = this.contactForm.value;

      const texto = `Hola Mariana, soy ${form.name}.%0A%0A${form.message}%0A%0A, Mis datos de contacto:%0ATel: ${form.phone}%0AEmail: ${form.email}`;
      const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${texto}`;

      window.open(whatsappUrl, '_blank');
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
