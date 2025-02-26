import React from "react";


const PopUp = ({ isOpen, onClose, onConfirm, selectedOption }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p>Apakah Anda yakin memilih: <strong>{selectedOption}</strong>?</p>
                <div className="mt-4 flex justify-center gap-4">
                    <button 
                        onClick={onClose} 
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Kembali
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Lanjut
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopUp;
