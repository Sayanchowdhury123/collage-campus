import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { createPostSchema } from '../../../backend/src/Validators/postvalidationschema';
import api from '../axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const CreatePost = () => {
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        setValue,
        watch,
        reset
    } = useForm({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            content: '',


        }
    });


    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue("cover", file);
            const reader = new FileReader();
            reader.onload = () => setPreviewAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const formData = new FormData();

            formData.append("content", data.content)


            const avatarFile = watch("cover");
            if (avatarFile) {
                formData.append("cover", avatarFile);
            }
            console.log(formData)
            const res = await api.post(`/post/add`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",

                },
            })

            console.log(res.data)
            toast.success("post created successfully")
            reset()
        } catch (error) {
            console.log(error)
            toast.error("post creation failed")
        } finally {
            setLoading(false)
        }



    };

    return (
        <div>


            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Create Post</h1>



                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div className="flex flex-col items-center mb-6">
                        <img
                            src={previewAvatar || "/default-avatar.png"}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-gray-200"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium mb-1">Content</label>
                        <textarea
                            {...register("content")}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter content"
                        ></textarea>
                        {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>}
                    </div>






                    <div className="pt-4">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-md text-white ${loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
                                } transition`}
                        >
                            {loading ? (<p className="">
                                Saving...<span className="loading text-white loading-spinner loading-sm ml-2"></span>
                            </p>) : (<p className="">
                                Create Post
                            </p>)}

                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default CreatePost
