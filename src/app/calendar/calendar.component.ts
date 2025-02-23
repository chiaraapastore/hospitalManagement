import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import {EventDialogComponent} from '../event-dialog/event-dialog.component';
import {Location} from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {


  constructor(public dialog: MatDialog, private location: Location) {}
  private totalFerie = 28;
  private ferieEstive = 15;
  events: EventInput[] = [];
  forceRerender = false;
  ngOnInit() {
    this.updateEvents();
    this.initializeCalendar();
  }

  goBack(): void {
    this.location.back();
  }

  private generateFerie(anno: number): EventInput[] {
    let ferie: EventInput[] = [];


    const startDate = new Date(anno, 5, 1);
    for (let i = 0; i < this.ferieEstive; i++) {
      let ferieDay = new Date(startDate);
      ferieDay.setDate(startDate.getDate() + i);
      ferie.push({ title: 'Ferie', date: ferieDay.toISOString().split('T')[0], classNames: ['ferie-event'] });
    }


    let remainingFerie = this.totalFerie - this.ferieEstive;
    let ferieDistribuite = 0;

    while (ferieDistribuite < remainingFerie) {
      let randomMonth = Math.floor(Math.random() * 12);
      let randomDay = Math.floor(Math.random() * 28) + 1;
      let ferieDay = new Date(anno, randomMonth, randomDay);


      if (ferieDay.getMonth() >= 5 && ferieDay.getMonth() <= 8) continue;

      ferie.push({ title: 'Ferie ', date: ferieDay.toISOString().split('T')[0], classNames: ['ferie-event'] });
      ferieDistribuite++;
    }

    return ferie;
  }

  generateEventsForYear(year: number): EventInput[] {
    return [
      ...this.generateFerie(year),
      { title: 'Capodanno ', date: `${year}-01-01` },
      { title: 'Epifania ', date: `${year}-01-06` },
      { title: 'Pasqua ', date: `${this.calculateEaster(year)}` },
      { title: 'Festa della Liberazione', date: `${year}-04-25` },
      { title: 'Festa del Lavoro️', date: `${year}-05-01` },
      { title: 'Ferragosto ', date: `${year}-08-15` },
      { title: 'Natale ', date: `${year}-12-25` },
      { title: 'Santo Stefano ', date: `${year}-12-26` }
    ];
  }
  private calculateEaster(year: number): string {
    let a = year % 19;
    let b = Math.floor(year / 100);
    let c = year % 100;
    let d = Math.floor(b / 4);
    let e = b % 4;
    let f = Math.floor((b + 8) / 25);
    let g = Math.floor((b - f + 1) / 3);
    let h = (19 * a + b - d - g + 15) % 30;
    let i = Math.floor(c / 4);
    let k = c % 4;
    let l = (32 + 2 * e + 2 * i - h - k) % 7;
    let m = Math.floor((a + 11 * h + 22 * l) / 451);
    let month = Math.floor((h + l - 7 * m + 114) / 31);
    let day = ((h + l - 7 * m + 114) % 31) + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  updateEvents(): void {
    this.events = this.generateEventsForYear(new Date().getFullYear());
    if (this.calendarOptions) {
      this.calendarOptions.events = this.events;
    }
  }

  initializeCalendar(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: this.events,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      },
      locale: 'it',
      eventColor: '#008080',
      eventTextColor: '#fff',
      rerenderDelay: 100,
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this)
    };
  }

  handleDateClick(info: any): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '250px',
      data: { date: info.dateStr }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addEvent(info.dateStr, result);
      }
    });
  }

  handleEventClick(info: any): void {
    const confirmDelete = confirm(`Vuoi eliminare l'evento "${info.event.title}" in data ${info.event.startStr}?`);
    if (confirmDelete) {
      this.deleteEvent(info.event.startStr, info.event.title);
    }
  }

  addEvent(date: string, title: string): void {
    this.events = [...this.events, { title, date }];
    this.updateCalendarEvents();
  }

  deleteEvent(date: string, title: string): void {
    this.events = this.events.filter(event => !(event.date === date && event.title === title));
    this.updateCalendarEvents();
  }

  updateCalendarEvents(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.events
    };
  }

  ngOnDestroy() {
    this.events = [];
  }


  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: this.events,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    locale: 'it',
    eventColor: '#008080',
    eventTextColor: '#fff',
    rerenderDelay: 100
  };

}
