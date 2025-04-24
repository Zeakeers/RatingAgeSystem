import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ListGames = () => {
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRatings, setSelectedRatings] = useState([]);

    // Daftar rating dengan deskripsi dan warna
    const ratingDescriptions = {
        "SU": { label: "Semua Umur", description: "Dapat dimainkan oleh semua orang tanpa batasan konten.", color: "text-green-600" },
        "3+": { label: "Usia 3+", description: "Tidak ada konten dewasa, perjudian, atau interaksi online.", color: "text-blue-600" },
        "7+": { label: "Usia 7+", description: "Ada unsur ringan seperti kekerasan kartun atau bahasa ringan.", color: "text-yellow-600" },
        "13+": { label: "Usia 13+", description: "Ada kekerasan moderat, simulasi perjudian, atau tema horor.", color: "text-orange-600" },
        "18+": { label: "Usia 18+", description: "Mengandung konten dewasa, kekerasan realistis, atau humor kasar.", color: "text-red-600" }
    };

    useEffect(() => {
        fetch("http://127.0.0.1:5000/all_games")
            .then(res => res.json())
            .then(data => {
                const formattedData = data.map(game => ({
                    name: game["Nama Game"], 
                    rating: game["Rating"] 
                }));
    
                setGames(formattedData);
                setFilteredGames(formattedData);
            })
            .catch(err => console.error("Error fetching game list:", err));
    }, []);
    

    // 🔍 Filter berdasarkan rating
    const handleRatingFilter = (rating) => {
        let updatedFilters = [...selectedRatings];
    
        if (updatedFilters.includes(rating)) {
            updatedFilters = updatedFilters.filter((r) => r !== rating);
        } else {
            updatedFilters.push(rating);
        }
    
        setSelectedRatings(updatedFilters);
    
        if (updatedFilters.length === 0 || updatedFilters.includes("SU")) {
            setFilteredGames(games);
        } else {
            const filtered = games.filter((game) => updatedFilters.includes(game.rating));
            setFilteredGames(filtered);
        }
    };
    
    

    // 🔎 Search game berdasarkan nama
    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = games.filter(game =>
            game.name.toLowerCase().includes(term)
        );

        setFilteredGames(filtered);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <div className="p-10">
                <h1 className="text-3xl font-bold mb-6">Daftar Game</h1>

                {/* Grid untuk filter di kiri, search + list game di kanan */}
                <div className="grid grid-cols-4 gap-4">
                {/* Bagian 1: Filter Rating */}
                <aside className="bg-gray-200 p-4 rounded h-fit">
                    <h2 className="text-xl font-bold mb-4">Filter Rating</h2>
                    <div className="space-y-2">
                        {Object.keys(ratingDescriptions).map((rating, index) => (
                            <label key={index} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4"
                                    checked={selectedRatings.includes(rating)}
                                    onChange={() => handleRatingFilter(rating)}
                                />
                                <span>{ratingDescriptions[rating].label}</span>
                            </label>
                        ))}
                    </div>
                </aside>

                {/* Bagian 2: Daftar Game */}
                <main className="col-span-3">
                    {/* Bagian 3: Search Form */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Cari game..."
                            className="p-2 border w-full"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Card List Game */}
                    <div className="grid grid-cols-2 gap-4">
                        {filteredGames.length > 0 ? (
                            filteredGames.map((game, index) => {
                                const ratingInfo = ratingDescriptions[game.rating] || {};
                                return (
                                    <div key={index} className="border p-4 bg-gray-200 rounded shadow-md">
                                        <h3 className="text-lg font-bold">{game.name}</h3>
                                        <p className={`font-semibold ${ratingInfo.color}`}>
                                            Rating: {ratingInfo.label}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {ratingInfo.description}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500">Tidak ada game yang sesuai.</p>
                        )}
                    </div>
                </main>
            </div>
            </div>

            <Footer className="mt-auto" />
        </div>
    );
};

export default ListGames;
