import React from 'react'
import { useForm } from 'react-hook-form';
import { MdOutlinePassword } from "react-icons/md";
import api from '../axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginZodschema, RegisterZodschema } from '../../../backend/src/Validators/authValidation';
import { motion } from "framer-motion";
import { authFailure, authStart, authSuccess } from '../features/authslice';
import { useDispatch } from 'react-redux';


export default function LoginForm() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset
    } = useForm({
        resolver: zodResolver(LoginZodschema),
        defaultValues: {

            email: '',
            password: '',

        }
    });


    const handleLogin = async (data) => {

        dispatch(authStart())
        try {

            const res = await api.post("/auth/login", data)
            dispatch(
                authSuccess({
                    user: res.data
                })
            )

            toast.success(res.data?.message || "Login successfull!");
            reset()
            navigate("/home")
        } catch (error) {
            console.error("Login error:", error);
            const msg = error.response?.data?.message || "Something went wrong";
            toast.error(msg);
        } finally {
            dispatch(authFailure())
        }
    }


    return (

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className='overflow-hidden'>
            <form onSubmit={handleSubmit(handleLogin)} className=" flex flex-col items-center h-screen justify-center text-sm p-8 text-slate-800">

                <h1 className="text-4xl font-bold py-4 text-center">Login Form</h1>


                <div className="max-w-96 w-full px-4">


                    <label htmlFor="email" className="font-medium mt-4">Email Address</label>
                    <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">

                        <input type="email" {...register("email")} className="h-full px-2 w-full outline-none bg-transparent" placeholder="Enter your email address" name='email' />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <label htmlFor="password" className="font-medium mt-4">Password</label>
                    <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">

                        <input type="password" {...register("password")} className="h-full px-2 w-full outline-none bg-transparent" placeholder="Enter Password" name='password' />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>





                    <button disabled={isSubmitting} type="submit" className="flex items-center justify-center gap-1 mt-5 bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 w-full rounded-full transition">
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>

                    <Link to={"/register"} className=''>
                        <p className='text-center mt-2 hover:text-gray-500'>
                            Don't have a account, Register now
                        </p>

                    </Link>
                </div>
            </form>
        </motion.div>



    );
};

