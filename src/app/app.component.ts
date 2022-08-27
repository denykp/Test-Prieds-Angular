import { Component } from '@angular/core';
import { VisitorService } from './visitor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'testing-app';
  constructor(private visitorService: VisitorService) {}

  ngOnInit(): void {
    this.visitorService.reloadSavedVisitor();
  }
}
