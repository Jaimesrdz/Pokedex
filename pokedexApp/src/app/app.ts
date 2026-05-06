import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { PokemonList } from './pokemon-list/pokemon-list';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, PokemonList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('pokedexApp');

  filterValue = '';
  onFilterChange(value:any) {
    this.filterValue = value;
  }

  searchValue = '';
  onSearch(value: string) {
    this.searchValue = value;
  }
}
