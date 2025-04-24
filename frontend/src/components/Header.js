import react from "react";

const Header = ({ scrollToSection }) => {
      const handleNavigation = (section) => {
        if (scrollToSection) {
            scrollToSection(section);
        } else {
            window.location.href = `/#${section}`;
        }
    };
    return (
        <div className="bg-yellow-500 text-white p-4 flex justify-between">
          <h1 className="text-3xl font-bold"></h1>
          <nav>
                <ul className="flex justify-end">
                    <li className="mr-4">
                        <button 
                            onClick={() => handleNavigation("home")} 
                            className="text-white hover:text-gray-300"
                        >
                            Beranda
                        </button>
                    </li>
                    <li className="mr-4">
                        <button 
                            onClick={() => handleNavigation("tentang")} 
                            className="text-white hover:text-gray-300"
                        >
                            Tentang
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => handleNavigation("kontak")} 
                            className="text-white hover:text-gray-300"
                        >
                            Kontak
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
      );
    };
    
export default Header;