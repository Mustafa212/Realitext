import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamingRobotComponent } from './gaming-robot.component';

describe('GamingRobotComponent', () => {
  let component: GamingRobotComponent;
  let fixture: ComponentFixture<GamingRobotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamingRobotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamingRobotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
