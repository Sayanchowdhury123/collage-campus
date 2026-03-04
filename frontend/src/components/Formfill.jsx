import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FormfillZodSchema, RegisterZodschema } from '../../../backend/src/Validators/authValidation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import api from '../axios';
import toast from 'react-hot-toast';


const Formfill = () => {
    const navigate = useNavigate()
    const loaction = useLocation()
    const { registerData } = loaction.state || {};

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset
    } = useForm({
        resolver: zodResolver(FormfillZodSchema),
        defaultValues: {

            batch: '',
            course: 'BCA',
            semester: '',
            collegeId: '',
            institute: '',
        }
    });

    const handleReg = async (data) => {
        try {
            if (registerData === undefined) return;

            const payload = {
                ...registerData,
                ...data,
                semester: Number(data.semester),
                batch: Number(data.batch),
            };

            const res = await api.post("/auth/register", payload)
            toast.success(res.data?.message || "Registered successfully!");

            reset()
            navigate("/email/sent")
        } catch (error) {
            console.error("Registration error:", error);
            const msg = error.response?.data?.message || "Something went wrong";
            toast.error(msg);
        }
    }


    return (
        <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='overflow-hidden'>
                <form onSubmit={handleSubmit(handleReg)} className=" flex flex-col justify-center h-screen items-center text-sm  text-slate-800">

                    <h1 className="text-4xl font-bold py-4 text-center">Register Form</h1>


                    <div className="max-w-96 w-full px-4">


                        <label htmlFor="batch" className="font-medium mt-4">Batch</label>
                        <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">

                            <input   {...register("batch", { valueAsNumber: true })}
                                type="number"
                                min="2020"
                                max="2030" className="h-full px-2 w-full outline-none bg-transparent" placeholder="Enter Batch" name='batch' />
                            {errors.batch && <p className="text-red-500 text-xs mt-1">{errors.batch.message}</p>}
                        </div>

                        <label htmlFor="College Id" className="font-medium mt-4">College Id</label>
                        <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">

                            <input type="text" {...register("collegeId")} className="h-full px-2 w-full outline-none bg-transparent" placeholder="Enter College Id" name='collegeId' />
                            {errors.collegeId && <p className="text-red-500 text-xs mt-1">{errors.collegeId.message}</p>}
                        </div>

                        <label htmlFor="Institute" className="font-medium mt-4">institute</label>
                        <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">

                            <input type="text" {...register("institute")} className="h-full px-2 w-full outline-none bg-transparent" placeholder="Enter institute name" name='institute' />
                            {errors.institute && <p className="text-red-500 text-xs mt-1">{errors.institute.message}</p>}
                        </div>


                        <label htmlFor="Course" className="font-medium mt-4">Course</label>
                        <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">

                            <input type="text" {...register("course")} className="h-full px-2 w-full outline-none bg-transparent" placeholder="Enter College Id" name='course' />
                            {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course.message}</p>}
                        </div>

                        <label htmlFor="Semester" className="font-medium mt-4">Semester</label>
                        <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">

                            <input type="text" min="1" max="8" {...register("semester", { valueAsNumber: true })} className="h-full px-2 w-full outline-none bg-transparent" placeholder="Enter Semester" name='semester' />
                            {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester.message}</p>}
                        </div>



                        <button disabled={isSubmitting} type="submit" className="flex cursor-pointer items-center justify-center gap-1 mt-5 bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 w-full rounded-full transition">
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>

                        <Link to={"/login"} className=''>
                            <p className='text-center mt-2 hover:text-gray-500'>
                                Already have a account, Login now
                            </p>

                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default Formfill
