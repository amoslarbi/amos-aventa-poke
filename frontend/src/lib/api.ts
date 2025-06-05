// Pokemon interface
export interface Pokemon {
  id: number;
  pokemon_id: number;
  name: string;
  api_url: string;
  created_at: string;
  updated_at: string;
}

// Get Pokemons from poke api
export async function triggerPokemonFetch(limit: number, offset: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/pokemon/fetch?limit=${limit}&offset=${offset}`, {
    method: "POST",
    cache: "no-store", // Ensure fetch runs only once
  });
  if (!response.ok) {
    throw new Error("Failed to trigger Pokémon fetch");
  }
  return response.json();
}

// Count number of rows in Pokemon table
export async function getPokemonCount() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/pokemon/count`, {
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon count");
  }
  const data = await response.json();
  return data.data;
}

// Get pokemons from Pokemon table
export async function fetchPokemon(limit: number = 20, offset: number): Promise<Pokemon[]> {
  const query = `
    query GetPokemon($limit: Int!, $offset: Int!) {
      pokemon(limit: $limit, offset: $offset) {
        id
        pokemon_id
        name
        api_url
        created_at
        updated_at
      }
      metadata {
        id
        total_count
        created_at
      }
    }
  `;
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/pokemon/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { limit, offset },
    }),
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon");
  }
  const { data } = await response.json();
  return data.pokemon;
}