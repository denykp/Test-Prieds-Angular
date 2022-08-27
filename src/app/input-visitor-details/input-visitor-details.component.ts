import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { visitor, VisitorService } from '../visitor.service';

@Component({
  selector: 'app-input-visitor-details',
  templateUrl: './input-visitor-details.component.html',
  styleUrls: ['./input-visitor-details.component.css'],
})
export class InputVisitorDetailsComponent implements OnInit {
  constructor(private visitorService: VisitorService) {}

  formField: visitor = {
    queueNumber: '',
    timeArrival: '',
    name: '',
    idNumber: '',
    phone: '',
    address: '',
    city: '',
  };

  listQueueNumber: string[];

  queueCtrl = new FormControl('');
  filteredOptions: Observable<string[]>;

  async ngOnInit(): Promise<void> {
    await this.loadListQueue();
    this.filteredOptions = this.queueCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.listQueueNumber.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  async loadListQueue() {
    this.listQueueNumber = await this.visitorService.getQueueNumber();
  }

  loadVisitor(event: any) {
    if (event.relatedTarget && event.relatedTarget.tagName === 'MAT-OPTION') {
      return;
    }
    if (this.formField.queueNumber) {
      this.visitorService
        .getVisitorByQueue(this.formField.queueNumber)
        .then((response) => {
          if (response) {
            this.formField = response;
          }
        })
        .catch((error) => {
          alert(error);
          this.resetVisitorField();
        });
    }
  }

  async saveVisitor() {
    await this.visitorService
      .updateVisitorDetails(this.formField)
      .then(() => {
        alert('Data visitor berhasil disimpan');
      })
      .catch((error) => {
        alert(error);
      });
  }

  resetVisitorField() {
    this.formField = {
      queueNumber: '',
      timeArrival: '',
      name: '',
      idNumber: '',
      phone: '',
      address: '',
      city: '',
    };
  }

  numbersOnly(event: any) {
    return !/\d/g.test(event.key) ? event.preventDefault() : true;
  }
}
