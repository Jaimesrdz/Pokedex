import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { Services } from '../services';
import { of } from 'rxjs';


describe('Header', () => {
  let component: Header;

  beforeEach(() => {
    component = new Header();
  });

  it('should emit search value', () => {
  jest.spyOn(component.search, 'emit');

  component.onSearch('pikachu');

  expect(component.search.emit).toHaveBeenCalledWith('pikachu');
  });

  it('should emit filter value', () => {
    jest.spyOn(component.filterChange, 'emit');

    component.onFilterChange('type');

    expect(component.filterChange.emit).toHaveBeenCalledWith('type');
  });
});