import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { visitor, VisitorService } from '../visitor.service';

@Component({
  selector: 'app-request-queue-number',
  templateUrl: './request-queue-number.component.html',
  styleUrls: ['./request-queue-number.component.css'],
})
export class RequestQueueNumberComponent implements OnInit {
  constructor(private visitorService: VisitorService) {}

  reprintNumber: '';

  listQueueNumber: string[];
  queueCtrl = new FormControl('');
  filteredOptions: Observable<string[]>;

  formField: visitor = {
    queueNumber: '',
    timeArrival: '',
    name: '',
    idNumber: '',
    phone: '',
    address: '',
    city: '',
  };

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
    console.log(this.listQueueNumber);
  }

  async generateQueue() {
    this.reprintNumber = '';
    this.formField = {
      queueNumber: '',
      timeArrival: '',
      name: '',
      idNumber: '',
      phone: '',
      address: '',
      city: '',
    };
    this.formField.queueNumber =
      await this.visitorService.generateQueueNumber();
    this.formField.timeArrival = moment().format('YYYY/MM/DD HH:mm:ss');

    await this.visitorService
      .addVisitor(this.formField)
      .then(async () => {
        await this.loadListQueue();
        alert('Visitor baru telah ditambahkan');
      })
      .catch((error) => console.log('Generate queue gagal', error));
  }

  async reprintQueue() {
    console.log(this.reprintNumber);
    this.visitorService
      .getVisitorByQueue(this.reprintNumber)
      .then((response) => {
        if (response) {
          this.formField = response;
        }
      })
      .catch((error) => {
        alert(error);
      });
  }
}
