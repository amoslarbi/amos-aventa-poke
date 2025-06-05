"use client";

import { useEffect, useState } from "react";
import PokemonList from "@/components/PokemonList";
import PokemonSearch from "@/components/PokemonSearch";
import Pagination from "@/components/Pagination";
import LimitDropdown from "@/components/LimitDropdown";
import FetchMoreModal from "@/components/FetchMoreModal";
import { fetchPokemon, triggerPokemonFetch, getPokemonCount } from "@/lib/api";
import { POKEMON_MAX } from "@/lib/constants";

// Pokemon interface
interface Pokemon {
  id: number;
  pokemon_id: number;
  name: string;
  api_url: string;
  created_at: string;
  updated_at: string;
}

export default function PokemonPage() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [maxPokemon, setMaxPokemon] = useState(POKEMON_MAX);
  const [pokemonsLeft, setPokemonsLeft] = useState(POKEMON_MAX);

  useEffect(() => {
    const initFetch = async () => {
      const hasFetched = localStorage.getItem("hasFetchedPokemon");
      if (!hasFetched) { // check if the data has been fetched already
        try {
          setIsLoading(true); // Set loader to engage user

          await triggerPokemonFetch(20, 0); // Fetch 20 items on first load
          localStorage.setItem("hasFetchedPokemon", "true");

          // Get total number of pokemons from database
          const maxCount = await getPokemonCount();
          setMaxPokemon(maxCount.count);

          // Calculate Pokemons remaining
          setPokemonsLeft(POKEMON_MAX - maxCount.count);

          // Fetch pokemons from database
          const data = await fetchPokemon(maxCount.count, 0);
          setPokemon(data);
          setFilteredPokemon(data);
          setTotal(data.length); // Total based on fetched data
          setIsLoading(false);

        } catch (error) {
          console.error("Error triggering initial fetch:", error);
          setIsLoading(false)
          alert("Failed to fetch initial Pokémons");
        }
      } else {
        setIsLoading(true);
        try {

          // Get total number of pokemons from database
          const maxCount = await getPokemonCount();
          setMaxPokemon(maxCount.count);
          // Calculate Pokemons remaining
          setPokemonsLeft(POKEMON_MAX - maxCount.count);

          // Fetch pokemons from database
          const data = await fetchPokemon(maxPokemon, 0);
          setPokemon(data);
          setFilteredPokemon(data);
          setTotal(data.length); // Total based on fetched data
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching Pokémon:", error);
          setIsLoading(false);
        }
      }
    };
    initFetch();
  }, []);

  // Filter Pokemon
  // useEffect(() => {
  //   if (searchTerm.length >= 3) {
  //     setFilteredPokemon(
  //       pokemon.filter((p) =>
  //         p.name.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     );
  //   } else {
  //     setFilteredPokemon(pokemon);
  //   }
  //   setTotal(filteredPokemon.length); // Update total based on filtered data
  //   setPage(1); // Reset to page 1 on search
  // }, [searchTerm, pokemon]);

  // Filter Pokemon
  useEffect(() => {
    if (searchTerm.length >= 3) {
      const filtered = pokemon.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemon(filtered);
    } else {
      setFilteredPokemon(pokemon);
    }
  }, [searchTerm, pokemon]);

  // Client-side pagination: slice data based on dynamic limit
  const paginatedPokemon = filteredPokemon.slice((page - 1) * limit, page * limit);

  return (
    <div className="container mx-auto p-4">
    <h1 className="text-3xl font-bold mb-4">Pokémon Explorer</h1>
    {/* Pokemon Search component */}
    <PokemonSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex justify-between items-center mb-4">
        {/* Limit Dropdown component */}
        <LimitDropdown limit={limit} setLimit={setLimit} setPage={setPage} />
        {/* Fetch more pokemons button and remaining pokemon count */}
        <div className="flex flex-col items-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          >
            Fetch More Pokemons
          </button>
          <span className="text-sm text-gray-600 mt-2">You have {pokemonsLeft} Pokemons remaining</span>
        </div>
      </div>
      {isLoading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : filteredPokemon.length === 0 && searchTerm.length >= 3 ? (
        <p className="text-center text-red-500 text-lg font-semibold">
          No Pokémon found for search term "{searchTerm}"
        </p>
      ) : (
        <>
          {/* List component for rendering pokemon list items */}
          <PokemonList pokemon={paginatedPokemon} />
          {/* Pagination component */}
          <Pagination
            page={page}
            setPage={setPage}
            limit={limit}
            total={total}
          />
        </>
      )}
    {/* Fetch More Modal component for adding more pokemons */}
    <FetchMoreModal
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      maxPokemon={maxPokemon}
    />
  </div>
  );
}