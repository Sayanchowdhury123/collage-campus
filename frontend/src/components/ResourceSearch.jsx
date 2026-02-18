import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchResources } from '../features/ResourceSlice'
import api from '../axios'
import { motion } from 'framer-motion'

const ResourceSearch = () => {
    const [title, setTitle] = useState("")
    const dispatch = useDispatch()
    const [uniqueItems, setUniqueItems] = useState({})
    const [semester, setSemester] = useState("All");
    const [subject, setSubject] = useState("All");
    const [course, setCourse] = useState("All");

    const fetchUnique = async () => {
        try {
            const res = await api.get("/resource/unique")

            setUniqueItems(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUnique()
    }, [])

    useEffect(() => {

        const filters = {};

        if (title.trim()) filters.title = title.trim();
        if (semester !== "All") filters.semester = semester;
        if (subject !== "All") filters.subject = subject;
        if (course !== "All") filters.course = course;


        dispatch(fetchResources({ ...filters, page: 1 }));
    }, [title, semester, subject, course, dispatch]);






    return (
        <motion.div initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-white rounded-lg shadow">

            <div className="mb-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Search resources by title..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="All">All Semesters</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <option key={sem} value={sem}>Semester {sem}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="All">All Subjects</option>
                        {uniqueItems.subjects?.map((s, i) => (
                            <option key={i} value={s}>{s}</option>
                        ))}
                    </select>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="All">All Courses</option>
                        {uniqueItems.courses?.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>
        </motion.div>

    )
}

export default ResourceSearch



