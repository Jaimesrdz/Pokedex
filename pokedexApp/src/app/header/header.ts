import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Output() sort = new EventEmitter<void>();
  
  sortClick() {
    this.sort.emit();
  }
}
