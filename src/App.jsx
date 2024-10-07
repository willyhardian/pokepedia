import "./App.css";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import Card from "./components/Card";
import { useEffect, useState } from "react";

function App() {
    const queryClient = new QueryClient();
    const limit = 20;
    const offset = 20;
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { isPending, error, data } = useQuery({
        queryKey: ["pokemons", page - 1],
        queryFn: async () => {
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon?offset=${
                    offset * (page - 1)
                }&limit=${limit}`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const responseJson = await response.json();
            return responseJson;
        },
        staleTime: 5000,
    });
    useEffect(() => {
        async function fetchData() {
            await queryClient.prefetchQuery({
                queryKey: ["pokemons", page],
                queryFn: async () => {
                    const response = await fetch(
                        `https://pokeapi.co/api/v2/pokemon?offset=${
                            offset * page
                        }&limit=${limit}`
                    );
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const responseJson = await response.json();
                    if (responseJson.results.length === 0) {
                        setHasMore(false);
                    } else {
                        setHasMore(true);
                    }
                    return responseJson;
                },
            });
        }
        fetchData();
    }, [data]);

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
                <div className="flex justify-center pagination">
                    <button
                        className="btn"
                        disabled={page - 1 === 0}
                        onClick={() => setPage((page) => page > 0 && page - 1)}
                    >
                        Previous
                    </button>
                    <button
                        className="btn"
                        disabled={!hasMore}
                        onClick={() => setPage((page) => hasMore && page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}

export default App;
