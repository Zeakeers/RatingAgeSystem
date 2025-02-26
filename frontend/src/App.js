import React, { useState } from "react";
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
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [rating, setRating] = useState(null);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");

    const checkGame = async () => {
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

    return (
        <div>
            <Header/>
                <div className="h-screen w-full bg-cover bg-center bg-no-repeat bg-black bg-opacity-50 flex items-center justify-center" 
                        style={{ backgroundImage: "url('/images/bgwebrating.png')", backgroundSize: "105%" }}>
                    <div className={`w-full max-w-lg p-6 text-center relative ${step > 0 || rating ? 'bg-white rounded-lg shadow-md' : ''}`}>
                        {step === 0 && !rating && (
                            <h1 className="text-6xl text-white text-2xl text-left font-bold ">Rating Umur Game</h1>
                        )}
                        {step > 0 && step <= questions.length && (
                        <div className="absolute top-4 right-4 flex space-x-2">
                            {step > 1 && (
                            <button 
                                onClick={() => {
                                setAnswers(answers.slice(0, -1));
                                setStep(step - 1);
                                }}
                                className="w-6 h-6 bg-yellow-500 rounded-full hover:bg-yellow-700"
                            />
                            )}

                            {/* Tombol merah: Kembali ke input nama game */}
                            <button 
                            onClick={() => {
                                setStep(0);
                                setAnswers([]);
                                setGameName("");
                            }}
                            className="w-6 h-6 bg-red-500 rounded-full hover:bg-red-700"
                            />
                        </div>
                        )}

                        {!rating && step === 0 && (
                        <>
                            <p className="mt-4 text-left text-white">Masukkan nama game:</p>
                            <input 
                            type="text" 
                            value={gameName} 
                            onChange={(e) => setGameName(e.target.value)} 
                            className="border border-gray-600 bg-gray-100 p-2 w-full mt-2 focus:bg-gray-200 focus:border-black rounded mt-1"
                            />
                            <button 
                            onClick={checkGame} 
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                            >
                            Cek
                            </button>
                        </>
                        )}

                        {!rating && step > 0 && step <= questions.length && (
                        <>
                            <p className="mt-4">{questions[step - 1]}</p>
                            {options.map((option) => (
                            <button 
                                key={option} 
                                onClick={() => handleOptionClick(option)}
                                className="block bg-gray-300 text-black px-4 py-2 rounded mt-2 hover:bg-gray-400 w-full"
                            >
                                {option}
                            </button>
                            ))}
                        </>
                        )}

                        {!rating && step > questions.length && (
                        <>
                            {/* Menampilkan tabel hasil jawaban */}
                            <div className="mt-4">
                            <h2 className="text-lg font-semibold">Hasil Jawaban Anda:</h2>
                            <table className="table-auto w-full border mt-4">
                                <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-4 py-2">Pertanyaan</th>
                                    <th className="border px-4 py-2">Jawaban</th>
                                </tr>
                                </thead>
                                <tbody>
                                {questions.map((question, index) => (
                                    <tr key={index}>
                                    <td className="border px-4 py-2">{question}</td>
                                    <td className="border px-4 py-2">{answers[index]}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            </div>

                            {/* Tombol kembali ke input game */}
                            <button 
                            onClick={() => {
                                setStep(0);
                                setAnswers([]);
                                setGameName("");
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full"
                            >
                            Kembali
                            </button>

                            {/* Tombol untuk konfirmasi hasil */}
                            <button 
                            onClick={submitAnswers} 
                            className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full"
                            >
                            Cek Hasil
                            </button>
                        </>
                        )}

                        {rating && (
                        <>
                            <h2 className="text-xl font-semibold mt-4">
                            Game <span className="font-bold text-blue-500">{gameName}</span> memiliki rating 
                            <span className="font-bold text-red-500"> {rating}</span>
                            </h2>
                            <p className="mt-2"><strong>Penjelasan:</strong> {ratingDescriptions[rating]}</p>
                            <button 
                            onClick={() => { 
                                setStep(0); 
                                setAnswers([]); 
                                setRating(null); 
                                setGameName("");
                            }} 
                            className="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full"
                            >
                            Coba Lagi
                            </button>
                        </>
                        )}

                        {/* Pop-up konfirmasi pilihan jawaban */}
                        <PopUp 
                        isOpen={isPopUpOpen} 
                        onClose={() => setIsPopUpOpen(false)} 
                        onConfirm={confirmSelection} 
                        selectedOption={selectedOption} 
                        />

                        {/* Pop-up konfirmasi cek hasil */}
                        <PopUp 
                        isOpen={isConfirmPopupOpen} 
                        onClose={() => setIsConfirmPopupOpen(false)} 
                        onConfirm={confirmSubmit} 
                        selectedOption="Apakah Anda yakin ingin melihat hasil rating?"
                        />
                    </div>
                 </div>
                <Tentang />
                <KategoriRating />
            <Footer />
        </div>
    );
};

export default App;