import { Component, OnInit, OnChanges, ChangeDetectorRef, Input, SimpleChanges, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, Observable } from 'rxjs';
import { Services } from '../services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'pokemon-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.css',
})
export class PokemonList implements OnInit, OnChanges {

  @Input() searchValue: string = '';
  @Input() filterTrigger: string = '';

  pokemonList: any[] = [];
  sortedPokemonList: any[] = [];
  displayedList: any[] = [];

  private offset = 0;
  private destroyRef = inject(DestroyRef);

  constructor(
    private dataService: Services,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataService.getPokemonList(this.offset)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        const requests: Observable<any>[] = data.results.map((pokemon: any) =>
          this.dataService.getAdditionalInfo(pokemon.name)
        );
        forkJoin(requests)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((pokemonDetails: any[]) => {
            this.offset += 24;
            this.pokemonList = pokemonDetails;
            this.displayedList = pokemonDetails;
            this.cd.detectChanges();
          });
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterTrigger']) {
      this.applyFilter();
    }
    if (changes['searchValue']) {
      this.onSearch();
    }
  }

  onSearch() {
    const base = this.sortedPokemonList.length
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
    } else if (this.filterTrigger === 'hp') {
      this.sortedPokemonList = [...this.pokemonList].sort((a, b) => b.stats[0].base_stat - a.stats[0].base_stat);
    }
    this.displayedList = this.sortedPokemonList;
  }

  loadNextPage() {
    this.dataService.getPokemonList(this.offset)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        const requests: Observable<any>[] = data.results.map((pokemon: any) =>
          this.dataService.getAdditionalInfo(pokemon.name)
        );
        forkJoin(requests)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((pokemonDetails: any[]) => {
            this.offset += 24;
            this.pokemonList = pokemonDetails;
            this.displayedList = pokemonDetails;
            this.sortedPokemonList = [];
            this.cd.detectChanges();
          });
      });
  }

  loadPreviousPage() {
    if (this.offset <= 24) return;
    const prevOffset = this.offset - 48;
    this.dataService.getPokemonList(prevOffset)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        const requests: Observable<any>[] = data.results.map((pokemon: any) =>
          this.dataService.getAdditionalInfo(pokemon.name)
        );
        forkJoin(requests)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((pokemonDetails: any[]) => {
            this.offset -= 24;
            this.pokemonList = pokemonDetails;
            this.displayedList = pokemonDetails;
            this.sortedPokemonList = [];
            this.cd.detectChanges();
          });
      });
  }
}
