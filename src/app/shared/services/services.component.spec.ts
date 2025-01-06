import { TestBed } from '@angular/core/testing';

import { ServicesComponent } from 'C:/Users/audros/IdeaProjects/ConfigBijoux2/src/app/shared/services/services.component';

describe('ServicesComponent', () => {
  let service: ServicesComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
