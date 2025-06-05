import { render, screen } from "@testing-library/react";
import PokemonList from "@/components/PokemonList";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("PokemonList", () => {
  const pokemon = [
    { id: 1, name: "bulbasaur", api_url: "https://pokeapi.co/api/v2/pokemon/1/" },
    { id: 2, name: "ivysaur", api_url: "https://pokeapi.co/api/v2/pokemon/2/" },
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

//   it("renders a list of Pokémon", () => {
//     render(<PokemonList pokemon={pokemon} />);

//     expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
//     expect(screen.getByText("Ivysaur")).toBeInTheDocument();
//     expect(screen.getAllByRole("link")).toHaveLength(2);
//     expect(screen.getByText("Bulbasaur").closest("a")).toHaveAttribute("href", "/pokemon/1");
//     expect(screen.getByText("Ivysaur").closest("a")).toHaveAttribute("href", "/pokemon/2");
//   });
});