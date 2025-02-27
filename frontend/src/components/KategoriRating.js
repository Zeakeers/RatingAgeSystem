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
    <div className="relative mt-[90px] mb-10 w-full h-[500px] flex items-center p-10">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/bg2.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-yellow-500 opacity-85"></div>

        {/* Konten utama */}
        <div className="relative flex w-full h-full items-center justify-between p-10">
          {/* Teks di sebelah kiri */}
          <div className="w-1/2 pr-5">
            <p className="text-black text-bold text-3xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis
              molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla
              accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.
              Maecenas eget condimentum velit, sit amet feugiat lectusLorem ipsum dolor 
              sit amet, consectetur adipiscing elit. Etiam eu turpismolestie, dictum est 
              a, mattis tellus. Sed dignissim, metus nec fringillaaccumsan, risus sem 
              sollicitudin lacus,ut interdum tellus elit sed risus.amet feugiat
               
            </p>
          </div>

          {/* Kotak putih sejajar kiri-kanan dengan efek flip */}
          <div className="w-1/2 flex flex-col items-end gap-5 relative">
            <div className="flex gap-5 overflow-hidden w-[500px]">
              {cards.slice(currentIndex, currentIndex + 2).map((card, index) => (
                <FlipCard key={index} imageUrl={card.imageUrl} text={card.text} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={prevSlide} className="w-8 h-8 bg-gray-400 rounded-full">◀</button>
              <button onClick={nextSlide} className="w-8 h-8 bg-gray-400 rounded-full">▶</button>
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
      className="w-64 h-80 perspective-1000"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d rounded-3xl shadow-xl ${
          flipped ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d", transition: "transform 0.7s ease-in-out", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Depan - Gambar */}
        <div className="absolute w-full h-full flex items-center justify-center rounded-3xl" style={{ backfaceVisibility: "hidden" }}>
          <img src={imageUrl} alt="Gambar" className="w-full h-full object-cover rounded-3xl" />
        </div>
        {/* Belakang - Teks */}
        <div className="absolute w-full h-full bg-gray-200 flex items-center justify-center rounded-3xl p-4" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <p className="text-black text-center px-4 py-2 text-2xl rounded-lg">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default KategoriRating;
  
  
  
