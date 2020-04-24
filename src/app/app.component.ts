import {
  Component,
  Type,
  Injector,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  Compiler,
} from '@angular/core';
import { FooComponent } from './foo/foo.component';
import { MyFormComponent } from './my-form/my-form.component';
import { Address } from './address';
import { ReactiveFormsModule } from '@angular/forms';

const formKeys: (keyof Address)[] = [
  'street',
  'houseNumber',
  'careOf',
  'postalCode',
  'city',
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'lazy-loaded-components';

  foo: Promise<Type<FooComponent>>;
  fooInjector: Injector;

  @ViewChild('vcr', { read: ViewContainerRef }) vcr: ViewContainerRef;
  myFormRef: ComponentRef<MyFormComponent>;

  constructor(private injector: Injector, private compiler: Compiler) {}

  loadFoo() {
    if (!this.foo) {
      this.fooInjector = Injector.create({
        providers: [
          {
            provide: 'fooData',
            useValue: { id: 1, title: 'emoji' },
          },
        ],
        parent: this.injector,
      });

      this.foo = import(`./foo/foo.component`).then(
        ({ FooComponent }) => FooComponent
      );
    }
  }

  async loadMyForm() {
    if (!this.myFormRef) {
      import('./my-form/my-form.component').then((c) => {
        const ngModuleFactory = this.compiler.compileModuleSync(
          c.ReactiveFormsModule
        );
        const ngModule = ngModuleFactory.create(this.vcr.injector);

        const factory = ngModule.componentFactoryResolver.resolveComponentFactory(
          c.MyFormComponent
        );

        this.myFormRef = this.vcr.createComponent(factory);
        const dataFromLocalStorage = this.loadAddressData();

        if (dataFromLocalStorage) {
          this.myFormRef.instance.formGroup.patchValue(dataFromLocalStorage);
        }
        // Don't forget to unsubscribe
        this.myFormRef.instance.submitForm.subscribe((address) => {
          this.persistAddressData(address);
        });

        this.myFormRef.instance.clearData.subscribe(() => {
          this.clearAddressData();
        });
      });
    }
  }

  loadAddressData(): Address | undefined {
    const address: any = {};
    if (!window.localStorage.getItem('do-reload')) {
      return undefined;
    }
    formKeys.forEach(
      (key) => (address[key] = window.localStorage.getItem(key))
    );
    return address;
  }

  persistAddressData(address: Address) {
    window.localStorage.setItem('do-reload', 'true');
    formKeys.forEach((key) =>
      window.localStorage.setItem(key, address[key].toString())
    );
  }

  clearAddressData() {
    this.myFormRef.instance.clearForm();
    window.localStorage.removeItem('do-reload');
    formKeys.forEach((key) => window.localStorage.removeItem(key));
  }
}
