import { TestBed, inject } from '@angular/core/testing';
import { AccountService} from './account.service';
//import { SettingService } from './settings.service';



describe('SettingServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountService]
    });
  });

  it('should be created', inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));
});
