import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { downloadfile, fetchDetails, upvotes } from '../features/ResourceSlice';
import Loadingscrenn from '../components/Loadingscrenn';
import toast from 'react-hot-toast';
import api from '../axios';

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
            const { fileUrl } = response.data;
             console.log(fileUrl)
           
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
    return (
        <div>
            <div className='mt-20'>
                <div>
                    <img src={r?.uploader?.image} alt="uploader name" />
                    <p>{r?.uploader?.name}</p>
                    <p>{r?.createdAt}</p>
                </div>
                <div>
                    <h1>{r.title}</h1>
                    <p>{r.description}</p>
                    <p>{r.course}</p>
                    <p>{r.subject}</p>
                    <p>{r.semester}</p>
                </div>

                <div>
                    <p>upvotes: {r?.upvotes?.length}</p>
                </div>
                <div>
                    <button
                        onClick={() => handledownload(r._id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    >
                        Download
                    </button>
                    <button onClick={() => dispatch(upvotes({ resourceid, userid: user.id }))} >upvote</button>
                </div>

            </div>
        </div>
    )
}

export default ResourceDetails;
