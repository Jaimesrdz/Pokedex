import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class Services {
  constructor(private http: HttpClient) {}

  // Receives JSON data from the API
  getPokemonList() {
      return this.http.get(`https://pokeapi.co/api/v2/pokemon?limit=30`);
  }

  getAdditionalInfo(name : string) {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  }
}