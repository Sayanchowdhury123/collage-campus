import React from 'react'
import { useNavigate } from 'react-router-dom'

const YourResource = () => {
const navigate = useNavigate()
    return (
        <div className='mt-20'>
            <div>
                <p>Your Resources</p>
                <button onClick={() => navigate("/resource/add")}>Add Resource</button>
            </div>
        </div>
    )
}

export default YourResource
