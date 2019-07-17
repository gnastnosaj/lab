import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AiuiComponent } from './aiui.component';

describe('AiuiComponent', () => {
  let component: AiuiComponent;
  let fixture: ComponentFixture<AiuiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AiuiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AiuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
