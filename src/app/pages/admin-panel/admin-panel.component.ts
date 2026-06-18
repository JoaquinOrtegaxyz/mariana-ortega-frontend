import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html'
})
export class AdminPanelComponent implements OnInit {
  activeTab: string = 'mis-propiedades';
  propertyForm: FormGroup;
  isLoading: boolean = false;
  successMessage: string = '';

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  activeProperties: any[] = [];
  archivedProperties: any[] = [];

  isEditing: boolean = false;
  currentEditId: number | null = null;
  existingImages: any[] = [];

  constructor(private fb: FormBuilder, private propertyService: PropertyService) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      price: [null],
      propertyType: [''],
      operationType: [''],
      street: [''],
      streetNumber: [''],
      bedrooms: [null],
      bathrooms: [null]
    });
  }

  ngOnInit() {
    this.loadActiveProperties();
  }

  changeTab(tab: string) {
    this.activeTab = tab;
    this.successMessage = '';
    this.clearImage();

    if (tab === 'mis-propiedades' || tab === 'archivados') {
      this.isEditing = false;
      this.currentEditId = null;
      this.existingImages = [];
      this.propertyForm.reset();
      this.propertyForm.patchValue({ propertyType: '', operationType: '' });
      if (tab === 'mis-propiedades') this.loadActiveProperties();
      if (tab === 'archivados') this.loadArchivedProperties();
    }
  }

  loadActiveProperties() {
    this.propertyService.getProperties(0, 100).subscribe({
      next: (res) => this.activeProperties = res.content || [],
    });
  }

  loadArchivedProperties() {
    this.propertyService.getArchivedProperties(0, 100).subscribe({
      next: (res) => this.archivedProperties = res.content || [],
    });
  }

  editProperty(prop: any) {
    this.isEditing = true;
    this.currentEditId = prop.id;
    this.changeTab('nueva');

    // 1. Buscamos las fotos reales para el select
    this.propertyService.getImagesByPropertyId(prop.id).subscribe({
      next: (imgs) => this.existingImages = imgs || []
    });

    // 2. Buscamos LA CASA COMPLETA para rellenar la descripción y ambientes
    this.propertyService.getPropertyById(prop.id).subscribe({
      next: (fullProp) => {
        this.propertyForm.patchValue({
          title: fullProp.title,
          description: fullProp.description || '', // ¡Ahora sí viaja la desc!
          price: fullProp.price || null,
          propertyType: fullProp.propertyType || '',
          operationType: fullProp.operationType || '',
          street: fullProp.location?.street || '',
          streetNumber: fullProp.location?.streetNumber || '',
          bedrooms: fullProp.characteristics?.bedrooms || null,
          bathrooms: fullProp.characteristics?.bathrooms || null
        });
      },
      error: (err) => console.error('Error trayendo la casa completa', err)
    });
  }

  onChangeCover(event: any) {
    const selectedId = Number(event.target.value);
    const img = this.existingImages.find(i => i.id === selectedId);
    if (img) {
      this.setAsCover(img);
    }
  }

  setAsCover(img: any) {
    if (this.currentEditId) {
      this.propertyService.setCoverImage(this.currentEditId, img.id).subscribe({
        next: () => {
          this.existingImages.forEach(i => {
            i.isCover = (i.id === img.id);
            i.cover = (i.id === img.id);
          });
          this.loadActiveProperties();
        },
        error: (err) => alert('Hubo un error al cambiar la portada')
      });
    }
  }

  deleteExistingImage(img: any) {
    if (confirm('¿Estás seguro de borrar esta foto? Se eliminará de la nube definitivamente.')) {
      this.propertyService.deleteImage(img.id).subscribe({
        next: () => {
          this.existingImages = this.existingImages.filter(i => i.id !== img.id);
          this.loadActiveProperties();
        },
        error: (err) => alert('Hubo un error al borrar la foto')
      });
    }
  }

  unarchiveProperty(id: number) {
    if (confirm('¿Restaurar esta propiedad? Volverá a estar visible para el público.')) {
      this.propertyService.unarchiveProperty(id).subscribe({
        next: () => this.loadArchivedProperties(),
      });
    }
  }

  archiveProperty(id: number) {
    if (confirm('¿Seguro que querés archivar esta propiedad?')) {
      this.propertyService.archiveProperty(id).subscribe({
        next: () => this.loadActiveProperties(),
      });
    }
  }

  deletePermanently(id: number) {
    if (confirm('¡CUIDADO! Esto eliminará la propiedad para siempre.')) {
      this.propertyService.deletePropertyPermanently(id).subscribe({
        next: () => this.loadArchivedProperties(),
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  clearImage() {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onSubmit() {
    if (this.propertyForm.valid) {
      this.isLoading = true;
      this.successMessage = '';

      const formValue = this.propertyForm.value;
      const payload = {
        title: formValue.title,
        description: formValue.description || '',
        price: formValue.price || 0,
        propertyType: formValue.propertyType || null,
        operationType: formValue.operationType || null,
        location: {
          street: formValue.street || '',
          streetNumber: formValue.streetNumber ? formValue.streetNumber.toString() : '',
          floor: '',
          apartment: ''
        },
        characteristics: {
          bedrooms: formValue.bedrooms || 0,
          bathrooms: formValue.bathrooms || 0,
          lotArea: 0,
          totalArea: 0,
          hasGarage: false,
          age: 0,
          latitude: 0,
          longitude: 0
        }
      };

      if (this.isEditing && this.currentEditId) {
        this.propertyService.updateProperty(this.currentEditId, payload).subscribe({
          next: (res) => {
             if (this.selectedFile && res.id) {
               this.propertyService.uploadImage(res.id, this.selectedFile).subscribe({
                 next: () => {
                   this.finishUpload('¡Propiedad actualizada con foto nueva!');
                 }
               });
             } else {
               this.finishUpload('¡Propiedad actualizada!');
             }
          }
        });
      } else {
        this.propertyService.createProperty(payload).subscribe({
          next: (res) => {
            if (this.selectedFile && res.id) {
              this.propertyService.uploadImage(res.id, this.selectedFile).subscribe({
                next: () => this.finishUpload('¡Propiedad y foto guardadas!')
              });
            } else {
              this.finishUpload('¡Propiedad guardada sin foto!');
            }
          }
        });
      }
    } else {
      this.propertyForm.markAllAsTouched();
    }
  }

  finishUpload(msg: string) {
    this.isLoading = false;
    this.successMessage = msg;
    this.propertyForm.reset();
    this.propertyForm.patchValue({ propertyType: '', operationType: '' });
    this.clearImage();
    this.isEditing = false;
    this.currentEditId = null;
    this.existingImages = [];
  }
}
