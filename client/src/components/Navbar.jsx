import { useAuthStore } from "../store/useAuthStore";
import { FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/chatterbee.png";

const Navbar = () => {
    const { logout, authUser } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="relative flex">
            <div className="w-12 bg-[#020c1b] h-screen fixed left-0 top-0"></div>

            <nav className="flex justify-between items-center bg-[#020c1b] text-white px-6 h-14 shadow-md w-full ml-12">
                <Link to={"/"}>
                    <div className="flex items-center">
                        <img src={logo} alt="Logo" className="w-40 h-auto" />
                    </div>
                </Link>
                {authUser ? (
                    <div className="flex items-center gap-4">
                        <Link to="/profile">
                            <FiUser className="text-lg cursor-pointer hover:text-gray-400 transition duration-200" />
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-base font-medium hover:text-gray-400 transition duration-200"
                        >
                            <FiLogOut className="text-lg" />
                        </button>
                    </div>
                ) : (
                    <div></div>
                )}
            </nav>

            {authUser && (
                <div className="fixed bottom-6 left-5 text-white">
                    <Link to="/setting">
                        <FiSettings className="text-lg cursor-pointer hover:text-gray-400 transition duration-200" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Navbar;
