import { useState } from "react";
import { triggerPokemonFetch, getPokemonCount } from "@/lib/api";
import { POKEMON_MAX } from '@/lib/constants';

// Fetch More Modal interface
interface FetchMoreModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  maxPokemon: number;
}

export default function FetchMoreModal({ isOpen, setIsOpen, maxPokemon }: FetchMoreModalProps) {
  const [fetchCount, setFetchCount] = useState<number | "">(10);

  const handleFetch = async () => {
    // Validate count input field
    if (!fetchCount || fetchCount <= 0) {
      alert("Please enter a valid number of Pokémon to fetch");
      return;
    }

    try {
      // Get total number of rows in the pokemon table
      const currentCount = await getPokemonCount();
      if (currentCount + fetchCount > POKEMON_MAX) {
        alert(`Cannot fetch ${fetchCount} more Pokémon. Maximum limit is ${maxPokemon}.`);
        setIsOpen(false);
        return;
      }

      // Cap max Pokemons fetched to20 to resect rate limits
      if (fetchCount > 20) {
        alert(`Cannot fetch more than 20 Pokémons in a single request.`);
        setIsOpen(false);
        return;
      }

      // Fetch more pokemons
      await triggerPokemonFetch(fetchCount, currentCount.count);
      alert(`Successfully fetched ${fetchCount} more Pokémons`);
      setIsOpen(false);
      setFetchCount(10);

      // Reload page to reflect latest changes
      window.location.reload();
    } catch (error) {
      console.error("Error fetching more Pokémon:", error);
      alert("Failed to fetch more Pokémon. Try again.");
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Fetch More Pokemons</h2>
        <input
          type="number"
          value={fetchCount}
          onChange={(e) => setFetchCount(e.target.value ? Number(e.target.value) : "")}
          placeholder="Number of Pokémon to fetch"
          className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleFetch}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        >
          Fetch
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="mt-2 w-full px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}