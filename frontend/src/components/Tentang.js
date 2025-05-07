import React from "react";

const Tentang = () => {
    return (
        <div className="bg-[#BBBBBB] w-full min-h-[400px] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 tracking-tight">
                        Tentang
                    </h1>
                    <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
                </div>
                
                <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                    <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-medium text-justify">
                        Klasifikasi gim itu penting, bukan untuk membatasi, tetapi agar semua orang terutama anak muda dapat bermain dengan aman dan sesuai usia.
                    </p>
                    
                    <p className="text-lg md:text-xl leading-relaxed text-gray-800 mt-6 font-medium text-justify">
                        Berdasarkan Peraturan Menteri Komunikasi dan Informatika Nomor 2 Tahun 2024, setiap gim yang beredar di Indonesia perlu melewati proses klasifikasi yang 
                        mempertimbangkan konten dan nilai-nilai budaya kita.
                    </p>
                    
                    <p className="text-lg md:text-xl leading-relaxed text-gray-800 mt-6 font-medium text-justify">
                        Di sini, kami mendukung langkah ini dengan semangat terbuka, agar para pengembang dan pemain sama-sama 
                        tahu mana yang pas buat siapa. Soal seru-seruan, tetap jalan, tapi tetap bijak juga.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 text-center">
                        <div className="text-3xl mb-3">🏷️</div>
                        <h3 className="text-xl font-semibold mb-2">Klasifikasi</h3>
                        <p className="text-gray-700">Sistem penilaian yang tepat untuk setiap gim</p>
                    </div>
                    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 text-center">
                        <div className="text-3xl mb-3">🛡️</div>
                        <h3 className="text-xl font-semibold mb-2">Keamanan</h3>
                        <p className="text-gray-700">Melindungi pemain sesuai usia</p>
                    </div>
                    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 text-center">
                        <div className="text-3xl mb-3">🎮</div>
                        <h3 className="text-xl font-semibold mb-2">Developer Game Indonesia</h3>
                        <p className="text-gray-700">Membantu developer game Indonesia dalam menentukan rating umur pada game yang sedang dibuat.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tentang;