import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableQr } from './table-qr';

describe('TableQr', () => {
  let component: TableQr;
  let fixture: ComponentFixture<TableQr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableQr],
    }).compileComponents();

    fixture = TestBed.createComponent(TableQr);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
