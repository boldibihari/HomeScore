import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStadiumComponent } from './update-stadium.component';

describe('UpdateStadiumComponent', () => {
  let component: UpdateStadiumComponent;
  let fixture: ComponentFixture<UpdateStadiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateStadiumComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateStadiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
