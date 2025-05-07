import React from "react";

const Footer = () => {
    return (
        <footer className="w-full bg-black text-white py-6 px-4 mt-auto">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                    <p className="text-base md:text-lg font-semibold">&copy; 2025 Rating Umur Game. All rights reserved.</p>
                    <p className="text-sm mt-1">
                        Developed by <a href="#" className="underline hover:text-yellow-400 transition-colors duration-200">Dimas Adi</a>
                    </p>
                </div>
                <ul className="flex items-center justify-center gap-4 mt-2 md:mt-0">
                    <li>
                        <a href="#" className="hover:text-yellow-400 transition-colors duration-200" aria-label="Facebook">
                            <i className="fab fa-facebook-f text-xl"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-yellow-400 transition-colors duration-200" aria-label="Twitter">
                            <i className="fab fa-twitter text-xl"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-yellow-400 transition-colors duration-200" aria-label="Instagram">
                            <i className="fab fa-instagram text-xl"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;