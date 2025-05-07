import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; 
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tentang from "./components/Tentang";
import KategoriRating from "./components/KategoriRating";
import PopUp from "./components/PopUp";

const questions = [
    "Seberapa banyak game ini mengandung kekerasan?",
    "Seberapa sering bahasa kasar digunakan dalam game ini?",
    "Seberapa banyak game ini mengandung konten dewasa?",
    "Seberapa sering game ini menampilkan penggunaan obat-obatan atau alkohol?",
    "Apakah game ini memiliki unsur simulasi perjudian?",
];

const options = [
    "Tidak Mengandung",
    "Sangat Sedikit Mengandung",
    "Agak Mengandung",
    "Cukup Mengandung",
    "Banyak Mengandung",
    "Sangat Banyak Mengandung"
];

const ratingDescriptions = {
    "SU": "Semua Umur - Dapat dimainkan oleh semua orang tanpa batasan konten.",
    "3+": "Usia 3 Tahun Keatas - Tidak ada konten dewasa, perjudian, atau interaksi online.",
    "7+": "Usia 7 Tahun Keatas - Ada unsur ringan seperti kekerasan kartun atau bahasa ringan.",
    "13+": "Usia 13 Tahun Keatas - Ada kekerasan moderat, simulasi perjudian, atau tema horor.",
    "18+": "Usia 18 Tahun Keatas - Mengandung konten dewasa, kekerasan realistis, atau humor kasar."
};

const App = () => {
    const [gameName, setGameName] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [rating, setRating] = useState(null);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [latestGames, setLatestGames] = useState([]);
    const [easterEggActive, setEasterEggActive] = useState(false);
    const homeRef = useRef(null);
    const tentangRef = useRef(null);
    const kontakRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (gameName.length > 1) {
            fetch(`http://127.0.0.1:5000/autocomplete?query=${gameName}`)
                .then(res => res.json())
                .then(data => setSuggestions(data.slice(0, 4)))
                .catch(err => console.error("Error fetching autocomplete:", err));
        } else {
            setSuggestions([]);
        }
    }, [gameName]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/latest_games")
            .then(res => res.json())
            .then(data => setLatestGames(data.slice(-5)))
            .catch(err => console.error("Error fetching latest games:", err));
    }, []);

    useEffect(() => {
        if (location.hash) {
            const section = location.hash.replace("#", "");
            scrollToSection(section);
        }
    }, [location]);

    const handleSelectGame = (selectedGame) => {
        setGameName(selectedGame);
        setSuggestions([]);
    };

    const checkGame = async () => {
        if (gameName.trim().toLowerCase() === "lulus 2025") {
            setEasterEggActive(true);
            setRating("🎉 BISMILLAH LULUS 2025 DENGAN SEDIKIT REVISI 🎓");
            return;
        }
    
        setEasterEggActive(false);
        const response = await fetch("http://127.0.0.1:5000/check_game", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ game_name: gameName }),
        });
        const data = await response.json();
    
        if (data.exists) {
            setRating(data.rating);
        } else {
            setStep(1);
        }
    };    
    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsPopUpOpen(true);
    };

    const confirmSelection = () => {
        setAnswers([...answers, selectedOption]);
        setStep(step + 1);
        setIsPopUpOpen(false);
    };

    const submitAnswers = async () => {
        setIsConfirmPopupOpen(true);
    };

    const confirmSubmit = async () => {
        setIsConfirmPopupOpen(false);
        const response = await fetch("http://localhost:5000/submit_answers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ game_name: gameName, answers }),
        });
        const data = await response.json();
        setRating(data.rating);
    };

    const fetchGameRating = async (game) => {
        const response = await fetch("http://127.0.0.1:5000/check_game", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ game_name: game }),
        });
        const data = await response.json();
    
        if (data.exists) {
            setGameName(game);
            setRating(data.rating);
            setStep(0);
        }
    };

    const scrollToSection = (section) => {
        if (section === "home") {
            homeRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (section === "tentang") {
            tentangRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (section === "kontak") {
            kontakRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <div className="min-h-screen bg-gray-50">
            <Header scrollToSection={scrollToSection} />
            
            {/* Hero Section */}
            <div 
                id="home" 
                ref={homeRef} 
                className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-black bg-opacity-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden" 
                style={{ 
                    backgroundImage: "url('/images/bgwebrating.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed"
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className={`w-full max-w-2xl p-6 sm:p-8 text-center relative ${step > 0 || rating ? 'bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl' : ''}`}>
                    {step === 0 && !rating && (
                        <h1 className="text-4xl sm:text-5xl md:text-6xl text-white font-bold tracking-tight mb-8">
                            Rating Umur Game
                        </h1>
                    )}

                    {step > 0 && step <= questions.length && (
                        <div className="absolute top-4 right-4 flex space-x-3 z-10">
                            {step > 1 && (
                                <button 
                                    onClick={() => {
                                        setAnswers(answers.slice(0, -1));
                                        setStep(step - 1);
                                    }}
                                    aria-label="Kembali"
                                    className="w-8 h-8 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-transform duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-300 border-2 border-white shadow-md hover:scale-110"
                                />
                            )}
                            <button 
                                onClick={() => {
                                    setStep(0);
                                    setAnswers([]);
                                    setGameName("");
                                }}
                                aria-label="Reset"
                                className="w-8 h-8 bg-red-500 rounded-full hover:bg-red-600 transition-transform duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-300 border-2 border-white shadow-md hover:scale-110"
                            />
                        </div>
                    )}

                    {!rating && step === 0 && (
                        <div className="space-y-6">
                            <p className="text-xl text-white font-medium">Masukkan nama game:</p>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={gameName} 
                                    onChange={(e) => setGameName(e.target.value)} 
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 bg-white/90 backdrop-blur-sm"
                                    placeholder="Ketik nama game..."
                                />
                                {suggestions.length > 0 && (
                                    <ul className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-[9999]">
                                        {suggestions.map((suggestion, index) => (
                                            <li 
                                                key={index} 
                                                className="px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                                                onClick={() => handleSelectGame(suggestion)}
                                            >
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <button 
                                onClick={checkGame} 
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={!gameName.trim()}
                            >
                                Cek Rating
                            </button>

                            {latestGames.length > 0 && (
                                <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                    <h2 className="text-white text-xl font-semibold mb-4">Game Terbaru:</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {latestGames.map((game, index) => (
                                            <button 
                                                key={index} 
                                                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300"
                                                onClick={() => fetchGameRating(game)}
                                            >
                                                {game}
                                            </button>
                                        ))}
                                        {latestGames.length >= 4 && (
                                            <a 
                                                href="/list-games" 
                                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-300"
                                            >
                                                Selengkapnya
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!rating && step > 0 && step <= questions.length && (
                        <div className="space-y-6 pt-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                                {questions[step - 1]}
                            </h2>
                            <div className="grid gap-3">
                                {options.map((option) => (
                                    <button 
                                        key={option} 
                                        onClick={() => handleOptionClick(option)}
                                        className="w-full px-6 py-4 bg-white hover:bg-yellow-50 text-gray-800 rounded-xl border-2 border-gray-200 hover:border-yellow-500 transition-all duration-300 text-left"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!rating && step > questions.length && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Hasil Jawaban Anda:</h2>
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Pertanyaan</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Jawaban</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {questions.map((question, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-800">{question}</td>
                                                <td className="px-6 py-4 text-sm text-gray-800">{answers[index]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => {
                                        setStep(0);
                                        setAnswers([]);
                                        setGameName("");
                                    }}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                                >
                                    Kembali
                                </button>
                                <button 
                                    onClick={submitAnswers} 
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                                >
                                    Cek Hasil
                                </button>
                            </div>
                        </div>
                    )}

                    {rating && (
                        <div className="space-y-6">
                            {easterEggActive ? (
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold text-red-600 mb-4">
                                        🎉 BISMILLAH LULUS 2025 DENGAN SEDIKIT REVISI 🎓
                                    </h2>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                        Game <span className="font-bold text-blue-600">{gameName}</span> memiliki rating 
                                        <span className="font-bold text-red-600"> {rating}</span>
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        <strong>Penjelasan:</strong> {ratingDescriptions[rating]}
                                    </p>
                                </div>
                            )}
                            <button 
                                onClick={() => { 
                                    setStep(0); 
                                    setAnswers([]); 
                                    setRating(null); 
                                    setGameName("");
                                    setEasterEggActive(false);
                                    window.location.reload();
                                }} 
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div id="tentang" ref={tentangRef}>
                <Tentang />
            </div>
            
            <KategoriRating />
            
            <div id="kontak" ref={kontakRef}>
                <Footer />
            </div>

            {/* Pop-ups */}
            <PopUp 
                isOpen={isPopUpOpen} 
                onClose={() => setIsPopUpOpen(false)} 
                onConfirm={confirmSelection} 
                selectedOption={selectedOption} 
            />

            <PopUp 
                isOpen={isConfirmPopupOpen} 
                onClose={() => setIsConfirmPopupOpen(false)} 
                onConfirm={confirmSubmit} 
                selectedOption="Apakah Anda yakin ingin melihat hasil rating?"
            />
        </div>
    );
};

export default App;