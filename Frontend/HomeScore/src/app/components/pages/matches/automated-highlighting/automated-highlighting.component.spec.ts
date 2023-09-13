import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutomatedHighlightingComponent } from './automated-highlighting.component';

describe('AutomatedHighlightingComponent', () => {
  let component: AutomatedHighlightingComponent;
  let fixture: ComponentFixture<AutomatedHighlightingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomatedHighlightingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomatedHighlightingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
