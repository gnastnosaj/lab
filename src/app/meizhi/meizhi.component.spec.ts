import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeizhiComponent } from './meizhi.component';

describe('MeizhiComponent', () => {
  let component: MeizhiComponent;
  let fixture: ComponentFixture<MeizhiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeizhiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeizhiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
