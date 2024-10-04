import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Card({ pokemon }) {
    const {
        isPending,
        error,
        data: pokemonDetail,
    } = useQuery({
        queryKey: ["pokemonDetail", pokemon.url],
        queryFn: async () => {
            const response = await fetch(pokemon.url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const responseJson = await response.json();
            return responseJson;
        },
    });
    return (
        <>
            {error && error?.message}
            {isPending ? (
                <div>Loading...</div>
            ) : (
                <div className="card card-image-cover border-2 border-gray-200 hover:border-2 hover:border-gray-300 cursor-pointer dark:border-gray-800 dark:hover:border-gray-700">
                    <img
                        src={
                            pokemonDetail.sprites?.other["official-artwork"]
                                .front_default
                        }
                        alt=""
                    />
                    <div className="card-body">
                        <h2 className="card-header">
                            {pokemon.name[0].toUpperCase() +
                                pokemon.name.slice(1).toLowerCase()}
                        </h2>
                        <p className="text-content2">
                            Are you looking to increase your productivity at
                            work?
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
