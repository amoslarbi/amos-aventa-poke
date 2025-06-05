import { render, screen, fireEvent } from "@testing-library/react";
import PokemonSearch from "@/components/PokemonSearch";
import "@testing-library/jest-dom";

describe("PokemonSearch", () => {
  it("updates search term on input change", () => {
    const setSearchTerm = jest.fn();
    render(<PokemonSearch searchTerm="" setSearchTerm={setSearchTerm} />);

    const input = screen.getByPlaceholderText("Search Pokémon (min 3 characters)");
    fireEvent.change(input, { target: { value: "bulb" } });
    expect(setSearchTerm).toHaveBeenCalledWith("bulb");
    expect(input).toHaveValue("bulb");
  });
});