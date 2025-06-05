import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { fetchPokemon, triggerPokemonFetch } from "@/lib/api";

describe("API Functions", () => {
  it("triggers Pokémon fetch", async () => {
    const response = await triggerPokemonFetch();
    expect(response).toEqual({ message: "Pokémon fetch started in the background" });
  });

  it("fetches Pokémon list", async () => {
    const pokemon = await fetchPokemon(10, 0);
    expect(pokemon).toEqual([
      { id: 1, name: "bulbasaur", api_url: `${process.env.NEXT_PUBLIC_POKE_BASE_URL}/pokemon/1/` },
    ]);
  });

  it("handles fetch error", async () => {
    server.use(
      http.post(`${process.env.NEXT_PUBLIC_BASE_URL}/graphql`, () => {
        return HttpResponse.json({}, { status: 500 });
      })
    );

    await expect(fetchPokemon(10, 0)).rejects.toThrow("Failed to fetch Pokémon");
  });
});