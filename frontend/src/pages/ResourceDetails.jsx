import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { downloadfile, fetchDetails, incDownload, upvotes } from '../features/ResourceSlice';
import Loadingscrenn from '../components/Loadingscrenn';
import toast from 'react-hot-toast';
import api from '../axios';
import { motion } from "framer-motion";
import { FaUserGraduate, FaDownload, FaThumbsUp, FaFilePdf, FaFilePowerpoint, FaFileWord, FaFileAlt } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";

const ResourceDetails = () => {
    const { resourceid } = useParams()
    const { r, loading } = useSelector((state) => state.resource)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const [url, setUrl] = useState(null)

    useEffect(() => {
        dispatch(fetchDetails(resourceid))
    }, [resourceid])



    if (loading) return <Loadingscrenn />


    const handledownload = async (resourceid) => {
        try {

            toast.success("Preparing download...");

            const response = await api.get(`/resource/download/${resourceid}`);
            dispatch(incDownload())
            const { fileUrl } = response.data;


            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Download started!");
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Download failed. Please try again.");
        }
    };

    const getFileIcon = (fileType) => {
        switch (fileType) {
            case 'pdf': return <FaFilePdf className="text-red-500" />;
            case 'ppt': return <FaFilePowerpoint className="text-orange-500" />;
            case 'doc': return <FaFileWord className="text-blue-500" />;
            default: return <FaFileAlt className="text-gray-500" />;
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto mt-20">
               
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => window.history.back()}
                    className="mb-8 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Resources
                </motion.button>

               
                <motion.div
                    
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-start gap-4">
                           
                            <div className="shrink-0">
                                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                                    {r?.fileType ? getFileIcon(r.fileType) : <FaFileAlt className="text-gray-400" />}
                                </div>
                            </div>

                            
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2 truncate">
                                    {r?.title}
                                </h1>

                                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <FaUserGraduate className="text-gray-400" />
                                        {r?.uploader?.name || 'Unknown'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiCalendar className="text-gray-400" />
                                        {new Date(r?.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                   
                    <div className="p-6">
                 
                        {r?.description && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{r.description}</p>
                            </div>
                        )}

                 
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-xs text-blue-600 font-medium mb-1">COURSE</p>
                                <p className="font-medium text-gray-900">{r?.course || 'N/A'}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-xs text-green-600 font-medium mb-1">SUBJECT</p>
                                <p className="font-medium text-gray-900">{r?.subject || 'N/A'}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-xs text-purple-600 font-medium mb-1">SEMESTER</p>
                                <p className="font-medium text-gray-900">Sem {r?.semester || 'N/A'}</p>
                            </div>
                        </div>

                       
                        <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <FaThumbsUp className="text-blue-600" />
                                <span className="font-medium text-gray-900">{r?.upvotes?.length || 0} upvotes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaDownload className="text-green-600" />
                                <span className="font-medium text-gray-900">{r?.downloads || 0} downloads</span>
                            </div>
                        </div>


                        <div className="flex flex-col sm:flex-row gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handledownload(r._id)}
                                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                            >
                                <FaDownload />
                                Download
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => dispatch(upvotes({ resourceid, userid: user.id }))}
                                className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-medium transition-colors"
                            >
                                <FaThumbsUp />
                                {r?.upvotes?.some(u => u.user === user.id) ? 'Upvoted' : 'Upvote'}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default ResourceDetails;















