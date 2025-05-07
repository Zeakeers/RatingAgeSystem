import React from "react";

const PopUp = ({ isOpen, onClose, onConfirm, selectedOption }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-2xl shadow-2xl px-8 py-7 max-w-xs sm:max-w-sm w-full text-center font-sans">
                <p className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                    Apakah Anda yakin memilih:
                    <br />
                    <span className="block mt-2 text-yellow-600 text-xl font-bold">{selectedOption}</span>
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors duration-200 shadow-sm focus:outline-none"
                    >
                        Kembali
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="px-6 py-2 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-colors duration-200 shadow-sm focus:outline-none"
                    >
                        Lanjut
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopUp;
