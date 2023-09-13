import { TestBed } from '@angular/core/testing';
import { PasswordValidator } from './password-validator.service';

describe('PasswordValidatorService', () => {
  let service: PasswordValidator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordValidator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
