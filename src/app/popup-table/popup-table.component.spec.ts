import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTableComponent } from './popup-table.component';

describe('PopupTableComponent', () => {
  let component: PopupTableComponent;
  let fixture: ComponentFixture<PopupTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
