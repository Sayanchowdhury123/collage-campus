// components/ResourceList.jsx
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResources, resetResources } from "../features/ResourceSlice";
import Loadingscrenn from "../components/Loadingscrenn";
import { motion } from "framer-motion";
import { FaFilePdf } from "react-icons/fa";
import { AiFillFilePpt } from "react-icons/ai";
import { IoIosDocument } from "react-icons/io";
import { BsFiletypeTxt } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";


const ResourceList = () => {
    const dispatch = useDispatch();
    const { items, loading, hasMore, error, initialLoading, page } = useSelector((state) => state.resource);
    const bottomref = useRef(null)
    const filters = {}
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(resetResources());
        dispatch(fetchResources({ page: 1, ...filters }));
    }, [filters?.subject, filters?.semester, filters?.course]);


    // useEffect(() => {
    //     if (!hasMore || loading) return;

    //     const handleScroll = () => {

    //         if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    //             dispatch(fetchResources({ page: items.length > 0 ? Math.floor(items.length / 10) + 1 : 2, ...filters }));
    //         }
    //     };

    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, [hasMore, loading, items.length]);

    useEffect(() => {
        if (loading) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {

                dispatch(fetchResources({ page: page+1, ...filters }));
            }
        }, {
            threshold: 1.0
        })

        if (bottomref.current) {
            observer.observe(bottomref.current)
        }

        return () => {
            if (bottomref.current) observer.unobserve(bottomref.current)
        }
    }, [loading, hasMore])

    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

    // if (initialLoading && page === 1) return <Loadingscrenn />

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto mt-20">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-3xl font-bold text-gray-900">Study Resources</h1>
                    <p className="mt-2 text-gray-600">
                        Browse and download study materials shared by your campus community
                    </p>
                </motion.div>


                {items.length > 0 ? (
                    <div className="space-y-5">
                        {items.map((resource, index) => (
                            <motion.div
                                key={resource._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.05
                                }}
                                whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                            >
                                <div className="p-5">
                                    <div className="flex items-start gap-4">

                                        <div className="shrink-0">
                                            <div className="bg-indigo-100 p-3 rounded-lg">
                                                {resource.fileType === "pdf" && (<FaFilePdf />)}
                                                {resource.fileType === "ppt" && (<AiFillFilePpt />)}
                                                {resource.fileType === "doc" && (<IoIosDocument />)}
                                                {resource.fileType === "txt" && (<BsFiletypeTxt />)}
                                                {resource.fileType === "image" && (<CiImageOn />)}

                                            </div>
                                        </div>


                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                                                {resource.title}
                                            </h3>

                                            <p className="text-gray-600 mb-3 line-clamp-2">
                                                {resource.description || "No description available"}
                                            </p>


                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full">
                                                    {resource.subject}
                                                </span>
                                                <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full">
                                                    Sem {resource.semester}
                                                </span>
                                                <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full">
                                                    {resource.course}
                                                </span>
                                            </div>


                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center gap-4">
                                                    <span>📥 {resource.downloads || 0} downloads</span>
                                                    <span>👍 {resource.upvotes?.length || 0} upvotes</span>
                                                </div>

                                                <button
                                                 onClick={() => navigate(`/resource/details/${resource._id}`)}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        <div ref={bottomref} className="h-5" />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="text-gray-400 mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No resources yet</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Be the first to upload study materials for your campus!
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/resource/add")}
                            className="mt-6 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Upload Resource
                        </motion.button>
                    </motion.div>
                )}


                 <div className="text-center">
                  {loading && (<span className="loading loading-xl  loading-spinner"></span>)}
                 </div>
                     
            

                {!hasMore && items.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                    >
                        <p className="text-gray-500 font-medium">You've reached the end!</p>
                        <p className="text-sm text-gray-400 mt-1">No more study materials to load</p>
                    </motion.div>
                )}
            </div>
        </div>

    );
};

export default ResourceList;










