import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneysMapComponent } from './journeys-map.component';

describe('JourneysMapComponent', () => {
  let component: JourneysMapComponent;
  let fixture: ComponentFixture<JourneysMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JourneysMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneysMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
