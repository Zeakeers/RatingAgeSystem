import react from "react";

const Header = () => {
    return (
        <div className="bg-yellow-500 text-white p-4 flex justify-between">
          <h1 className="text-3xl font-bold"></h1>
          <nav>
            <ul className="flex justify-end">
              <li className="mr-4">
                <a href="#" className="text-white hover:text-gray-300">
                  Beranda
                </a>
              </li>
              <li className="mr-4">
                <a href="#" className="text-white hover:text-gray-300">
                  Tentang
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-300">
                  Kontak
                </a>
              </li>
            </ul>
          </nav>
        </div>
      );
    };
    
export default Header;