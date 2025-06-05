import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const server = setupServer(
  http.post(`${process.env.BASE_URL}/pokemon/fetch`, () => {
    return HttpResponse.json({ message: "Pokémon fetch started in the background" });
  }),
  http.post(`${process.env.BASE_URL}/graphql`, ({ request }) => {
    const body = request.body as any;
    const { query } = body;
    if (query.includes("pokemon(limit: 10, offset: 0)")) {
      return HttpResponse.json({
        data: {
          pokemon: [
            { id: 1, name: "bulbasaur", api_url: `${process.env.NEXT_PUBLIC_POKE_BASE_URL}/pokemon/1/` },
          ],
        },
      });
    }
    return HttpResponse.json({}, { status: 400 });
  })
);