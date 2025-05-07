import { useState, useEffect } from "react";

const Header = ({ scrollToSection }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleNavigation = (section) => {
        setIsMenuOpen(false);
        if (scrollToSection) {
            scrollToSection(section);
        } else {
            window.location.href = `/#${section}`;
        }
    };

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlNavbar);
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);

    return (
        <header className={`fixed w-full bg-yellow-500 shadow-md transition-transform duration-300 z-50 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-white"></h1>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-gray-200 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Desktop menu */}
                    <nav className="hidden md:flex space-x-8">
                        <button
                            onClick={() => handleNavigation("home")}
                            className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Beranda
                        </button>
                        <button
                            onClick={() => handleNavigation("tentang")}
                            className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Tentang
                        </button>
                        <button
                            onClick={() => handleNavigation("kontak")}
                            className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Kontak
                        </button>
                    </nav>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-yellow-500 shadow-lg">
                    <button
                        onClick={() => handleNavigation("home")}
                        className="block w-full text-left text-white hover:text-gray-200 px-3 py-2 rounded-md text-base font-medium"
                    >
                        Beranda
                    </button>
                    <button
                        onClick={() => handleNavigation("tentang")}
                        className="block w-full text-left text-white hover:text-gray-200 px-3 py-2 rounded-md text-base font-medium"
                    >
                        Tentang
                    </button>
                    <button
                        onClick={() => handleNavigation("kontak")}
                        className="block w-full text-left text-white hover:text-gray-200 px-3 py-2 rounded-md text-base font-medium"
                    >
                        Kontak
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;