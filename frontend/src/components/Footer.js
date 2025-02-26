import react from "react";

const Footer = () => {
    return (
        <div className="bg-black p-4 text-center text-white">
          <p>&copy; 2025 Rating Umur Game. All rights reserved.</p>
          <p>
            Developed by <a href="#" className="text-white hover:text-white">Dimas Adi</a>
          </p>
          <ul className="flex justify-center mb-4">
            <li className="mr-4">
              <a href="#" className="text-white hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
            </li>
            <li className="mr-4">
              <a href="#" className="text-white hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
            </li>
          </ul>
        </div>
      );
    };
export default Footer;