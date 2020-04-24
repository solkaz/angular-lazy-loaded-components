import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';

@Component({
  selector: 'app-foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooComponent implements OnInit {
  title = this.data.title;

  constructor(@Inject('fooData') private data) {
    console.log(data);
  }
  ngOnInit(): void {}
}
