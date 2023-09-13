import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChild('information') elementToScrollToRef!: ElementRef;

  onButtonClick() {
    const elementToScrollTo = this.elementToScrollToRef.nativeElement;
    elementToScrollTo.scrollIntoView({ behavior: 'smooth' });
  }
}
