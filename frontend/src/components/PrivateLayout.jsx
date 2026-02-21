
import Navbar from './Navbar';
import Sidebar from './Sidebar';


const PrivateLayout = ({ children }) => {
    return (
        <div className="relative">
            <Navbar />
            <Sidebar />

            {children}

        </div>
    );
};

export default PrivateLayout;