import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UtenteService } from '../services/utente.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {Location} from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userDetails: any = {
    firstName: '',
    lastName: '',
    email: '',
    numeroMatricola: '',
    telefono: '',
    reparto: { name: '' },
    profileImage: 'https://i.pinimg.com/736x/d7/21/20/d7212055f559c6b02c183ddc8699fe4b.jpg'
  };
  selectedFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private utenteService: UtenteService, private http: HttpClient, private toastr: ToastrService, private location: Location) {}

  ngOnInit(): void {
    this.utenteService.getUserInfo().subscribe(
      (data) => {
        if (data) {
          this.userDetails = data;
          if (!this.userDetails.reparto) {
            this.userDetails.reparto = { name: 'Nessun reparto assegnato' };
          }
          if (!this.userDetails.profileImage) {
            this.userDetails.profileImage = 'https://i.pinimg.com/736x/d7/21/20/d7212055f559c6b02c183ddc8699fe4b.jpg';
          }
        }
      },
      (error) => {
        console.error('Errore nel recupero dati utente', error);
      }
    );
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  goBack(): void {
    this.location.back();
  }
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.userDetails.profileImage = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile as Blob);
      }
    }
  }


  updateProfile(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post(`/api/upload-profile-image/${this.userDetails.id}`, formData).subscribe(
        (response: any) => {
          console.log('Immagine caricata', response);
          this.userDetails.profileImage = response.imageUrl;
        },
        (error) => console.error('Errore nel caricamento dell\'immagine', error)
      );
    }

    this.utenteService.updateUtente(this.userDetails.id, this.userDetails).subscribe(
      () => {
        this.toastr.success('Profilo aggiornato con successo!', 'Successo');
      },
      (error) => {
        console.error('Errore aggiornamento profilo', error);
        this.toastr.error('Errore aggiornamento profilo', 'Errore');
      }
    );
  }
}
