import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private showChangeSettings: boolean = false;
  private subject = new Subject<any>();

  constructor() { }

  toggleShowAddSettings(): void {
    this.showChangeSettings = !this.showChangeSettings;
    this.subject.next(this.showChangeSettings);
  }

  onToggle(): Observable<any> {
    return this.subject.asObservable();
  }
}
