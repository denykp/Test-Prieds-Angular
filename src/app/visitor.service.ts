import { Injectable } from '@angular/core';
import * as moment from 'moment';

export interface visitorResponse {
  data: visitor[];
}

export interface visitor {
  queueNumber: string;
  timeArrival: string;
  name: string;
  idNumber: string;
  phone: string;
  address: string;
  city: string;
}

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  constructor() {}

  dummyCount = 5;
  listVisitor: visitor[] = [];

  getVisitorList(): Promise<visitorResponse> {
    let dummyVisitor: visitor[] = [];
    if (!this.listVisitor.length) {
      for (let i = 1; i <= this.dummyCount; i++) {
        dummyVisitor.push({
          queueNumber: `A${i.toString().padStart(3, '0')}`,
          timeArrival: moment()
            .add(i, 'minute')
            .add(-1, 'hour')
            .format('YYYY/MM/DD HH:mm:ss'),
          name: `I'am Visitor ${i}`,
          idNumber: `${111000111000 + i}`,
          phone: `0${8123123123 + i}`,
          address: `Address of Visitor ${i}`,
          city: `City of Visitor ${i}`,
        });
      }
    }
    this.listVisitor = this.listVisitor.concat(dummyVisitor);
    return Promise.resolve<visitorResponse>({ data: this.listVisitor });
  }

  getVisitorByQueue(queueNumber: string): Promise<visitor> {
    console.log('queueNumber', queueNumber);
    const allVisitor = [...this.listVisitor];
    const response = allVisitor.filter(
      (val) => val.queueNumber === queueNumber
    );
    console.log('response', response, allVisitor);
    if (response.length) {
      return Promise.resolve<visitor>({ ...response[0] });
    } else {
      throw new Error('Queue Number not found');
    }
  }

  generateQueueNumber(): Promise<string> {
    const allVisitor = [...this.listVisitor];
    let listQueue = allVisitor
      .map((val) => val.queueNumber)
      .sort((next: any, prev: any) => (next > prev ? -1 : 1));

    if (listQueue.length) {
      const lastQueue = listQueue[0];
      const newQueue = parseInt(lastQueue.substring(1)) + 1;
      return Promise.resolve(`A${newQueue.toString().padStart(3, '0')}`);
    }
    return Promise.resolve('');
  }

  getQueueNumber(): Promise<string[]> {
    const allVisitor = [...this.listVisitor];
    let listQueue = allVisitor
      .map((val) => val.queueNumber)
      .sort((next: any, prev: any) => (next > prev ? 1 : -1));
    return Promise.resolve(listQueue);
  }

  addVisitor(visitor: visitor): Promise<void> {
    this.listVisitor.push(visitor);
    localStorage.setItem('listVisitor', JSON.stringify(this.listVisitor));
    return Promise.resolve();
  }

  updateVisitorDetails(visitor: visitor): Promise<void> {
    const idxData = this.listVisitor.findIndex(
      (val) => val.queueNumber === visitor.queueNumber
    );
    console.log('idxData', idxData);
    if (idxData >= 0) {
      Object.keys(visitor).forEach((key) => {
        this.listVisitor[idxData][key] = visitor[key];
      });
      localStorage.setItem('listVisitor', JSON.stringify(this.listVisitor));
      return Promise.resolve();
    } else {
      throw new Error('Queue Number not found');
    }
  }

  reloadSavedVisitor(): Promise<void> {
    this.listVisitor = JSON.parse(localStorage.getItem('listVisitor') || '[]');
    return Promise.resolve();
  }
}
