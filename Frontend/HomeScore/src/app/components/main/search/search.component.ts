import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { UserService } from 'src/app/services/backend/user/user.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  public loading: boolean = false;
  public text!: string;
  public result!: any[];

  constructor(private userService: UserService) {}

  public search(): void {
    this.loading = true;
    this.userService
      .search(this.text)
      .subscribe((result: Array<Array<any>>) => {
        this.result = result;
        this.loading = false;
      });
  }

  public closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    console.log(this.visible);
  }
}
