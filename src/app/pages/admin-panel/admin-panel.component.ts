import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropertyService } from '../../services/property.service';
import { ConfigService } from '../../services/config.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html'
})
export class AdminPanelComponent implements OnInit {
  activeTab: string = 'mis-propiedades';
  propertyForm: FormGroup;
  configForm: FormGroup;
  isLoading: boolean = false;
  successMessage: string = '';

  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  activeProperties: any[] = [];
  archivedProperties: any[] = [];

  isEditing: boolean = false;
  currentEditId: number | null = null;
  existingImages: any[] = [];

  toastMessage: string = '';

  showToast(msg: string) {
    this.toastMessage = msg;
    setTimeout(() => this.toastMessage = '', 4000);
  }

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private authService: AuthService


  ) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      price: [null],
      propertyType: [''],
      operationType: [''],
      zone:[''],
      street: [''],
      streetNumber: [''],
      bedrooms: [null],
      bathrooms: [null],
      totalArea: [null],
      lotArea: [null]
    });

    this.configForm = this.fb.group({
      whatsapp: ['', Validators.required],
      instagram: [''],
      facebook: [''],
      currentPassword: [''],
      newPassword: ['']
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        this.changeTab(tab);
      } else {
        this.changeTab('mis-propiedades');
      }
    });

    this.configService.getConfig().subscribe({
      next: (data) => {
        if(data) {
          this.configForm.patchValue({
            whatsapp: data.whatsapp || '',
            instagram: data.instagram || '',
            facebook: data.facebook || ''
          });
        }
      }
    });
  }

  changeTab(tab: string) {
    this.activeTab = tab;
    this.successMessage = '';
    this.clearImages();

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

    this.propertyService.getImagesByPropertyId(prop.id).subscribe({
      next: (imgs) => this.existingImages = imgs || []
    });

    this.propertyService.getPropertyById(prop.id).subscribe({
      next: (fullProp) => {
        this.propertyForm.patchValue({
          title: fullProp.title,
          description: fullProp.description || '',
          price: fullProp.price || null,
          propertyType: fullProp.propertyType || '',
          operationType: fullProp.operationType || '',
          zone: fullProp.location?.zone || '',
          street: fullProp.location?.street || '',
          streetNumber: fullProp.location?.streetNumber || '',
          bedrooms: fullProp.characteristics?.bedrooms || null,
          bathrooms: fullProp.characteristics?.bathrooms || null,
          totalArea: fullProp.characteristics?.totalArea || null,
          lotArea: fullProp.characteristics?.lotArea || null
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
        next: () => {
           this.archivedProperties = this.archivedProperties.filter(p => p.id !== id);
           this.showToast('¡Propiedad restaurada con éxito!');
        },
      });
    }
  }

  archiveProperty(id: number) {
    if (confirm('¿Seguro que querés archivar esta propiedad?')) {
      this.propertyService.archiveProperty(id).subscribe({
        next: () => {
           this.activeProperties = this.activeProperties.filter(p => p.id !== id);
           this.showToast('¡Propiedad archivada correctamente!');
        },
      });
    }
  }

  deletePermanently(id: number) {
    if (confirm('¡CUIDADO! Esto eliminará la propiedad para siempre.')) {
      this.propertyService.deletePropertyPermanently(id).subscribe({
        next: () => {
           this.archivedProperties = this.archivedProperties.filter(p => p.id !== id);
           this.showToast('Propiedad eliminada de la base de datos');
        },
      });
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 15 * 1024 * 1024) {
          alert(`El archivo "${file.name}" es demasiado pesado (máximo 15 MB).`);
          continue;
        }
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
        reader.readAsDataURL(file);
      }
      event.target.value = '';
    }
  }

  removeSelectedFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  clearImages() {
    this.selectedFiles = [];
    this.imagePreviews = [];
  }

  async onSubmit() {
    if (this.propertyForm.valid) {
      this.isLoading = true;
      this.successMessage = '';

      const formValue = this.propertyForm.value;

      let lat = -38.5545;
      let lon = -58.7396;

      if (formValue.street && formValue.streetNumber) {
         let calleMapeada = formValue.street.trim();

         if (!isNaN(Number(calleMapeada))) {
            calleMapeada = 'Calle ' + calleMapeada;
         }

         const query = `${calleMapeada} ${formValue.streetNumber}, Necochea, Provincia de Buenos Aires, Argentina`;
         const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

         try {
           const res = await fetch(url);
           const data = await res.json();
           if (data && data.length > 0) {
             lat = parseFloat(data[0].lat);
             lon = parseFloat(data[0].lon);
           }
         } catch (e) {
           console.error('Error buscando el mapa, usando Necochea por defecto:', e);
         }
      }

      const payload = {
        title: formValue.title,
        description: formValue.description || '',
        price: formValue.price ? Number(formValue.price) : 0,
        propertyType: formValue.propertyType || null,
        operationType: formValue.operationType || null,
        location: {
          street: formValue.street || '',
          streetNumber: formValue.streetNumber ? formValue.streetNumber.toString() : '',
          zone: formValue.zone ? formValue.zone : null,
          floor: '',
          apartment: ''
        },
        characteristics: {
          bedrooms: formValue.bedrooms ? Number(formValue.bedrooms) : 0,
          bathrooms: formValue.bathrooms ? Number(formValue.bathrooms) : 0,
          totalArea: formValue.totalArea ? Number(formValue.totalArea) : 0,
          lotArea: formValue.lotArea ? Number(formValue.lotArea) : 0,
          hasGarage: false,
          age: 0,
          latitude: lat,
          longitude: lon
        }
      };

      if (this.isEditing && this.currentEditId) {
        this.propertyService.updateProperty(this.currentEditId, payload).subscribe({
          next: (res) => {
             if (this.selectedFiles.length > 0 && res.id) {
               this.propertyService.uploadMultipleImages(res.id, this.selectedFiles).subscribe({
                 next: () => this.finishUpload(`¡Propiedad actualizada con éxito y ${this.selectedFiles.length} foto(s) nueva(s)!`),
                 error: (err) => {
                   this.isLoading = false;
                   alert('Se actualizó la propiedad pero falló la carga de las imágenes. Intentá subirlas desde "Editar".');
                 }
               });
             } else {
               this.finishUpload('¡Propiedad actualizada con éxito!');
             }
          },
          error: (err) => {
            this.isLoading = false;
            console.error('DETALLE DEL ERROR DEL BACKEND (EDITAR):', err.error);
            alert('Error al actualizar la propiedad. Apretá F12 y mirá la consola para ver qué campo rebotó.');
          }
        });
      } else {
        this.propertyService.createProperty(payload).subscribe({
          next: (res) => {
            if (this.selectedFiles.length > 0 && res.id) {
              this.propertyService.uploadMultipleImages(res.id, this.selectedFiles).subscribe({
                next: () => this.finishUpload(`¡Propiedad creada con éxito y ${this.selectedFiles.length} foto(s) guardadas!`),
                error: (err) => {
                  this.isLoading = false;
                  alert('Se guardó la propiedad pero falló la carga de las fotos. Podés subirlas desde "Editar".');
                }
              });
            } else {
              this.finishUpload('¡Propiedad creada con éxito!');
            }
          },
          error: (err) => {
            this.isLoading = false;
            console.error('DETALLE DEL ERROR DEL BACKEND (CREAR):', err.error);
            alert('Error al crear la propiedad. Apretá F12 y mirá la consola para ver qué campo rebotó.');
          }
        });
      }
    } else {
      this.propertyForm.markAllAsTouched();
    }
  }

  finishUpload(msg: string) {
    this.isLoading = false;
    this.showToast(msg);
    this.propertyForm.reset();
    this.propertyForm.patchValue({ propertyType: '', operationType: '', zone: '' });
    this.clearImages();
    this.isEditing = false;
    this.currentEditId = null;
    this.existingImages = [];
    this.changeTab('mis-propiedades');
  }

  onConfigSubmit() {
    if (this.configForm.valid) {
      const formValues = this.configForm.value;

      const configData = {
        whatsapp: formValues.whatsapp,
        instagram: formValues.instagram,
        facebook: formValues.facebook
      };

      this.configService.updateConfig(configData).subscribe({
        next: () => {
          this.successMessage = '¡Configuración guardada correctamente!';
          setTimeout(() => this.successMessage = '', 4000);
        },
        error: () => alert('Hubo un error al guardar las redes.')
      });

      if (formValues.currentPassword && formValues.newPassword) {
        const passData = {
          currentPassword: formValues.currentPassword,
          newPassword: formValues.newPassword
        };

        this.authService.changePassword(passData).subscribe({
          next: () => {
            this.successMessage = '¡Redes y contraseña actualizadas con éxito!';
            this.configForm.patchValue({ currentPassword: '', newPassword: '' });
          },
          error: (err) => {
            alert('Error: La contraseña actual es incorrecta.');
          }
        });
      }
    }
  }
}
