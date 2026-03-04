
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { hideNotification } from '../features/SocketSlice';
import { useNavigate } from 'react-router-dom';


const PrivateLayout = ({ children }) => {
    const { showNotification } = useSelector((state) => state.socket)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSeeClick = () => {

        dispatch(hideNotification());
        navigate("/notifications")
    };
    return (
        <div className="relative">
            <Navbar />

            <Sidebar />



            {showNotification && (
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} role="alert" className="alert  alert-vertical sm:alert-horizontal fixed top-17 right-4 z-50 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 className="font-bold">New Notification!</h3>
                        <p>You have a new message</p>
                    </div>
                    <button
                        onClick={handleSeeClick}
                        className="btn btn-sm btn-ghost cursor-pointer"
                    >
                        See
                    </button>
                </motion.div>
            )}



            {children}

        </div>
    );
};

export default PrivateLayout;