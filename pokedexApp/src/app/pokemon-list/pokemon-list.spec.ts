import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonList } from './pokemon-list';
import { Services } from '../services';
import { of } from 'rxjs';


describe('PokemonList', () => {
  let component: PokemonList;
  let fixture: ComponentFixture<PokemonList>;

  const mockService = {
    getPokemonList: jest.fn(),
    getAdditionalInfo: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonList],
      providers: [
        { provide: Services, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pokemon data', () => {
  mockService.getPokemonList.mockReturnValue(of({
    results: [{ name: 'bulbasaur' }]
  }));

  mockService.getAdditionalInfo.mockReturnValue(of({
    name: 'bulbasaur',
    id: 1,
    types: [{ type: { name: 'grass' } }]
  }));

  component.ngOnInit();

  expect(component.pokemonList.length).toBeGreaterThan(0);
});

it('should filter pokemon by name', () => {
  component.pokemonList = [
    { name: 'bulbasaur' },
    { name: 'charmander' }
  ];

  component.searchValue = 'bulb';
  component.applyFilter();

  expect(component.displayedList.length).toBe(1);
  expect(component.displayedList[0].name).toBe('bulbasaur');
});

it('should sort pokemon by id', () => {
  component.pokemonList = [
    { id: 5, name: 'charmeleon' },
    { id: 1, name: 'bulbasaur' }
  ];

  component.filterTrigger = 'id';
  component.applyFilter();

  expect(component.displayedList[0].id).toBe(1);
});

it('should sort pokemon by type', () => {
  component.pokemonList = [
    { types: [{ type: { name: 'fire' } }] },
    { types: [{ type: { name: 'grass' } }] }
  ];

  component.filterTrigger = 'type';
  component.applyFilter();

  expect(component.displayedList[0].types[0].type.name).toBe('fire');
});
});