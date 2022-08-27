import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { visitor, visitorResponse, VisitorService } from '../visitor.service';

@Component({
  selector: 'app-visitor-list',
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.css'],
})
export class VisitorListComponent implements OnInit {
  constructor(private visitorService: VisitorService, private router: Router) {}

  moment: any = moment;

  listVisitor: visitor[];
  searchName: '';
  searchCity: '';
  displayedColumns: string[] = [
    'queueNumber',
    'timeArrival',
    'name',
    'idNumber',
    'phone',
    'address',
    'city',
  ];

  ngOnInit(): void {
    this.loadVisitor();
  }

  async loadVisitor() {
    const { data } = await this.visitorService.getVisitorList();
    console.log(data);
    if (data.length) {
      if (this.searchName || this.searchCity) {
        this.listVisitor = data
          .filter((val: visitor) =>
            this.searchName ? val.name.includes(this.searchName) : true
          )
          .filter((val: visitor) =>
            this.searchCity ? val.city.includes(this.searchCity) : true
          );
      } else {
        this.listVisitor = data;
      }
    }
  }
}
