import { Component, OnInit, ChangeDetectorRef, Input, SimpleChanges } from '@angular/core';
import { Services } from '../services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-pokemon-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.css',
})
export class PokemonList implements OnInit {

  @Input() searchValue: string = '';
  @Input() filterTrigger: string = '';

  pokemonList: any[] = [];
  sortedPokemonList: any[] = [];
  displayedList: any[] = [];

  constructor(
    private dataService: Services,
    private cd: ChangeDetectorRef
  ) {}



  ngOnInit(): void {
    this.dataService.getPokemonList().subscribe((data: any) => {
      data.results.forEach((pokemon: any) => {
        this.dataService.getAdditionalInfo(pokemon.name).subscribe((info: any) => {
          this.displayedList = [...this.displayedList, info];
          this.pokemonList = this.displayedList;
          console.log(info);
          console.log(this.displayedList);

          // FORCE DETECT PLEASE WORK (it worked)
          this.cd.detectChanges();
        });
      });
    });
  }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['filterTrigger']) {
        this.applyFilter();
        console.log("filtering..."); {
        }
      }
      if (changes['searchValue']) {
        this.onSearch();
      }
      }

  onSearch() {
    console.log("searching...");

    let base = this.sortedPokemonList.length
      ? this.sortedPokemonList
      : this.pokemonList;

    if (!this.searchValue) {
      this.displayedList = base;
    } else {
      this.displayedList = base.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
  }

  applyFilter() {
    if (this.filterTrigger === 'type') {
      this.sortedPokemonList = [...this.pokemonList].sort((a, b) =>
      a.types[0].type.name.localeCompare(b.types[0].type.name)
    );
    } else if (this.filterTrigger === 'id') {
    this.sortedPokemonList = [...this.pokemonList].sort((a, b) => a.id - b.id);
    }
      else if (this.filterTrigger === 'hp') {
        this.sortedPokemonList = [...this.pokemonList].sort((a, b) => b.stats[0].base_stat - a.stats[0].base_stat);
      }
    this.displayedList = this.sortedPokemonList;
    console.log(this.displayedList);
  }

}