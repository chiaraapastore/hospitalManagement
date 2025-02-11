import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  backgroundImage = "https://i.pinimg.com/736x/3e/45/d1/3e45d1580247e9aff0718387e5f6c7a8.jpg";
  testimonials = [
    { text: 'HospitalCare ha rivoluzionato la nostra gestione delle scorte di medicine. Altamente raccomandato', author: 'Dr. Sara B.' },
    { text: 'Grazie a HospitalCare, abbiamo ridotto gli stockout del 30%.', author: 'Dr. Marco L.' },
    { text: 'HospitalCare ci ha aiutato a migliorare l\'efficienza del nostro magazzino. Ora possiamo concentrarci di più sui pazienti e meno sulla logistica.', author: 'Dr. Anna R.' },
    { text: 'La piattaforma è estremamente affidabile e ci ha permesso di risparmiare tempo e risorse. Consigliatissima', author: 'Dr. Antonio R.' },
    { text: 'Con HospitalCare, abbiamo ridotto i tempi di gestione delle scorte del 40%. Un vero cambiamento per la nostra struttura!', author: 'Dr. Giovanni V.' },
    { text: 'La segnalazione automatica dei riordini è una funzionalità fantastica. Non dobbiamo più preoccuparci di rimanere senza scorte!', author: 'Dr. Luca A.' },

  ];

  scrollIndex = 0;
  testimonialsPerPage = 3;

  get visibleTestimonials() {
    return this.testimonials.slice(this.scrollIndex, this.scrollIndex + this.testimonialsPerPage);
  }

  scrollCarousel(direction: number) {
    const maxScrollIndex = Math.max(0, this.testimonials.length - this.testimonialsPerPage);

    this.scrollIndex += direction * this.testimonialsPerPage;

    if (this.scrollIndex < 0) {
      this.scrollIndex = maxScrollIndex;
    } else if (this.scrollIndex > maxScrollIndex) {
      this.scrollIndex = 0;
    }
  }
}
