import "./App.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Card from "./components/Card";

function App() {
    const { isPending, error, data } = useQuery({
        queryKey: ["pokemons"],
        queryFn: async () => {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon/");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const responseJson = await response.json();
            return responseJson;
        },
    });

    return (
        <>
            <div className="container mx-auto">
                {error && error?.message}
                {isPending ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid grid-cols-4 gap-4">
                        {data?.results?.map((pokemon, idx) => {
                            return (
                                <Card key={pokemon?.name} pokemon={pokemon} />
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
