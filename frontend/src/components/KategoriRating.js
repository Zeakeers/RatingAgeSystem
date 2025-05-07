import React, { useState } from "react";

const KategoriRating = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const cards = [
        { imageUrl: "/images/SU.png", text: "Semua Umur - Dapat dimainkan oleh semua orang tanpa batasan konten." },
        { imageUrl: "/images/3+.png", text: "Usia 3 Tahun Keatas - Tidak ada konten dewasa, perjudian, atau interaksi online." },
        { imageUrl: "/images/7+.png", text: "Usia 7 Tahun Keatas - Ada unsur ringan seperti kekerasan kartun atau bahasa ringan." },
        { imageUrl: "/images/13+.png", text: "Usia 13 Tahun Keatas - Ada kekerasan moderat, simulasi perjudian, atau tema horor." },
        { imageUrl: "/images/18+.png", text: "Usia 18 Tahun Keatas - Mengandung konten dewasa, kekerasan realistis, atau humor kasar." }
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
            <div 
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: "url('/images/bg2.jpg')" }}
            ></div>
            <div className="absolute inset-0 bg-yellow-500 opacity-90"></div>

            {/* Konten utama */}
            <div className="relative max-w-7xl mx-auto w-full">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Kategori Rating
                    </h2>
                    <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-center">
                    {/* Teks di sebelah kiri */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                            <p className="text-white text-lg md:text-xl leading-relaxed font-medium text-justify">
                                Dalam Peraturan Menteri Komunikasi dan Informatika Nomor 2 Tahun 2024, 
                                gim diklasifikasikan berdasarkan kelompok usia pengguna: 3+, 7+, 13+, dan 18+. 
                                Setiap kategori ini mempertimbangkan jenis konten yang ditampilkan, seperti kekerasan, 
                                bahasa, unsur horor, hingga interaksi daring.
                            </p>
                            <p className="text-white text-lg md:text-xl leading-relaxed font-medium mt-4 text-justify">
                                Semakin tinggi kelompok usia, semakin kompleks pula konten yang diizinkan, 
                                namun tetap dalam batasan yang tidak melanggar norma dan hukum yang berlaku. 
                                Klasifikasi ini bertujuan agar setiap pengguna dapat memainkan gim yang sesuai 
                                dengan tingkat kedewasaan mereka, serta membantu orang tua dalam mengawasi 
                                pilihan hiburan digital anak-anaknya.
                            </p>
                        </div>
                    </div>

                    {/* Cards di sebelah kanan */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center">
                        <div className="flex gap-4 overflow-x-auto w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl justify-center">
                            {cards.slice(currentIndex, currentIndex + (window.innerWidth < 1024 ? 1 : 2)).map((card, index) => (
                                <FlipCard key={index} imageUrl={card.imageUrl} text={card.text} />
                            ))}
                        </div>
                        <div className="flex gap-6 mt-8">
                            <button 
                                onClick={prevSlide} 
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-yellow-400 text-yellow-600 hover:text-white shadow transition-all duration-300 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button 
                                onClick={nextSlide} 
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-yellow-400 text-yellow-600 hover:text-white shadow transition-all duration-300 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FlipCard = ({ imageUrl, text }) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[300px] h-[320px] sm:h-[360px] md:h-[400px] perspective-1000 cursor-pointer flex-shrink-0"
            onMouseEnter={() => setFlipped(true)}
            onMouseLeave={() => setFlipped(false)}
        >
            <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-3d rounded-3xl shadow-xl ${
                    flipped ? "rotate-y-180" : ""
                }`}
                style={{ 
                    transformStyle: "preserve-3d", 
                    transition: "transform 0.7s ease-in-out", 
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" 
                }}
            >
                {/* Depan - Gambar */}
                <div 
                    className="absolute w-full h-full flex items-center justify-center rounded-3xl overflow-hidden bg-white" 
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img 
                        src={imageUrl} 
                        alt="Rating" 
                        className="w-full h-full object-contain rounded-3xl p-4" 
                    />
                </div>
                {/* Belakang - Teks */}
                <div 
                    className="absolute w-full h-full bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-3xl p-6" 
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <p className="text-gray-800 text-center text-lg font-medium leading-relaxed">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default KategoriRating;
  
  
  
