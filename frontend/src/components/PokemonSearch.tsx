// Pokemon Search interface
interface PokemonSearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
  }
  
  export default function PokemonSearch({ searchTerm, setSearchTerm }: PokemonSearchProps) {
    return (
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Pokémon (min 3 characters)"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }