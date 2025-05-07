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
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Header />

            {/* Add top padding to prevent header overlap */}
            <div className="pt-20 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto w-full">
                <h1 className="text-4xl font-extrabold mb-8 text-gray-800 tracking-tight">Daftar Game</h1>

                {/* Responsive grid: filter on top on mobile, left on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Filter */}
                    <aside className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md h-fit mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold mb-4 text-yellow-600">Filter Rating</h2>
                        <div className="space-y-3">
                            {Object.keys(ratingDescriptions).map((rating, index) => (
                                <label key={index} className="flex items-center space-x-3 text-lg">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 accent-yellow-500 rounded"
                                        checked={selectedRatings.includes(rating)}
                                        onChange={() => handleRatingFilter(rating)}
                                    />
                                    <span>{ratingDescriptions[rating].label}</span>
                                </label>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="md:col-span-3">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Cari game..."
                                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 transition-all duration-300 bg-white/90 text-lg"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>

                        {/* Game Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGames.length > 0 ? (
                                filteredGames.map((game, index) => {
                                    const ratingInfo = ratingDescriptions[game.rating] || {};
                                    return (
                                        <div key={index} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 hover:shadow-xl transition-shadow duration-300">
                                            <h3 className="text-xl font-bold text-gray-800">{game.name}</h3>
                                            <p className={`font-semibold ${ratingInfo.color}`}>
                                                Rating: {ratingInfo.label}
                                            </p>
                                            <p className="text-gray-500 text-base">
                                                {ratingInfo.description}
                                            </p>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 col-span-full text-center">Tidak ada game yang sesuai.</p>
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
