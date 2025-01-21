import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MbomPageComponent } from './mbom-page.component';

describe('MbomPageComponent', () => {
  let component: MbomPageComponent;
  let fixture: ComponentFixture<MbomPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MbomPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MbomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
