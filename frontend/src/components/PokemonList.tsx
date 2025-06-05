import { formatDateTime } from "@/lib/helpers";

// Pokemon interface
interface Pokemon {
  id: number;
  pokemon_id: number;
  name: string;
  api_url: string;
  created_at: string;
  updated_at: string;
}

interface PokemonListProps {
  pokemon: Pokemon[];
}

export default function PokemonList({ pokemon }: PokemonListProps) {
  return (
    <ul className="flex flex-col gap-4 mb-4">
      {pokemon.map((p) => (
        <li key={p.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-center">
              <div>
                <span className="capitalize text-lg font-semibold">{p.name}</span>
                <p className="text-sm text-gray-500">Pokémon ID: {p.pokemon_id}</p>
              </div>
              <div className="text-sm text-gray-500 text-right">
                {/* Invoke formatDateTime function from helpers and format created_at and updated_at */}
                <p className="text-sm text-gray-600">Created: {formatDateTime(p.created_at)}</p>
                <p className="text-sm text-gray-600">Updated: {formatDateTime(p.updated_at)}</p>
              </div>
            </div>
        </li>
      ))}
    </ul>
  );
}