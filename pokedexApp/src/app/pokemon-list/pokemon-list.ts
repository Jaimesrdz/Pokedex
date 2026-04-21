import { Component } from '@angular/core';
import { Services } from '../services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-list',
  imports: [CommonModule],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.css',
})

export class PokemonList {
  constructor(private dataService: Services) {}

  pokemonList: any[] = [];

  ngOnInit() {
    this.dataService.getPokemonList().subscribe((data : any) => {
      data.results.forEach((pokemon : any) => {
        this.dataService.getAdditionalInfo(pokemon.name).subscribe((info : any) => {
          console.log(info);
          this.pokemonList = [...this.pokemonList, info];
        });
      });
    });
  }
  sortClick() {
    this.pokemonList.sort((a, b) => a.types[0].type.name.localeCompare(b.types[0].type.name));
    console.log("Sorted")
  }
}