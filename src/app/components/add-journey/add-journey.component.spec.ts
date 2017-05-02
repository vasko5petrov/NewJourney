import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJourneyComponent } from './add-journey.component';

describe('AddJourneyComponent', () => {
  let component: AddJourneyComponent;
  let fixture: ComponentFixture<AddJourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddJourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
