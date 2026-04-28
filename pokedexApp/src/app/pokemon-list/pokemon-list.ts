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

  @Input() sortTrigger: number = 0;
  @Input() searchValue: string = '';

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

  sortClick() {
    this.sortedPokemonList = [...this.pokemonList].sort((a, b) =>
      a.types[0].type.name.localeCompare(b.types[0].type.name)
    );
    console.log("Sorted");
    this.cd.detectChanges();
  }

    ngOnChanges(changes: SimpleChanges) {
  if (changes['sortTrigger']) {
    this.sortClick();
    if (this.sortTrigger % 2 === 0) {
      this.displayedList = this.pokemonList;
    } else {
      this.displayedList = this.sortedPokemonList;
    }
  }
  if (changes['searchValue']) {
    this.onSearch();
  }
  }

  onSearch() {
    console.log("searching...");
    const base =
      this.sortTrigger % 2 === 0
        ? this.pokemonList
        : this.sortedPokemonList;

    if (!this.searchValue) {
      this.displayedList = base;
    } else {
      this.displayedList = base.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchValue.toLowerCase())
        );
      }
    }
}