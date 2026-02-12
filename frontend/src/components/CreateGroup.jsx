import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { createPostSchema } from '../../../backend/src/Validators/postvalidationschema';
import api from '../axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { updatePost } from '../features/PostSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { groupupdateschema, groupzodschema } from '../../../backend/src/Validators/GroupZod';
import { createGroup, editgrp } from '../features/GroupSlice';

const Creategroup = () => {
 
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()
    const { g } = location.state || {};
    const [previewAvatar, setPreviewAvatar] = useState(g ? g?.coverimage : null);



    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        setValue,
        watch,
        reset
    } = useForm({
        resolver: zodResolver(g ? groupupdateschema : groupzodschema),
        defaultValues: {
            name:'',
            description:''


        }
    });

    useEffect(() => {
        if (g) {
            reset({ name: g?.name || '' ,description: g?.description || ''});
            setValue('coverimage', null);
        }
    }, [g,reset,setValue]);


    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue("coverimage", file);
            const reader = new FileReader();
            reader.onload = () => setPreviewAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const formData = new FormData();

            formData.append("name", data.name)
            formData.append("description", data.description)


            const avatarFile = watch("coverimage");
            if (avatarFile) {
                formData.append("coverimage", avatarFile);
            }

            if (g) {
                const result = await dispatch(
                    editgrp({gid:g?._id,formData})
                );

                if (editgrp.fulfilled.match(result)) {
                    toast.success("Group updated successfully!");


                } else {
                    toast.error(result.payload || "Update failed");
                }


            } else {
                const res = await dispatch(createGroup(formData))


                if (createGroup.fulfilled.match(res)) {
                    toast.success("group created successfully!");


                } else {
                    toast.error(result.payload || "operation failed");
                }
            }


            setTimeout(() => {
                navigate("/groups")
            }, 500);

            setPreviewAvatar(null)
            setValue("coverimage", null)
            reset({ name: '',description:''});

        } catch (error) {

            toast.error("operation failed")
        } finally {
            setLoading(false)
        }



    };

    return (
        <div className='h-screen w-full '>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto my-11"
            >

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">{g ? "Update Group" : "Create New Group"}</h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Share updates, resources, or announcements in your groups
                    </p>
                </div>

                <motion.div

                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">


                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Attach Image (Optional)
                            </label>

                            <div className="flex items-center gap-4">
                                {previewAvatar ? (
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        className="relative"
                                    >
                                        <img
                                            src={previewAvatar}
                                            alt="Preview"
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewAvatar(null);
                                                setValue("coverimage", null);
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >
                                            ×
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}

                                <label className="cursor-pointer">
                                    <span className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                                        {previewAvatar ? "Change Image" : "Upload Image"}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Choose a name
                            </label>
                            <input
                                id="name"
                                {...register("name")}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none resize-none"
                                placeholder="Write your post here... (Max 1000 characters)"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                            )}
                            <p className="text-xs text-gray-500 text-right">
                                {watch("name")?.length || 0}/50
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Choose a description
                            </label>
                            <textarea
                                id="description"
                                {...register("description")}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none resize-none"
                                placeholder="Write your post here... (Max 1000 characters)"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                            )}
                            <p className="text-xs text-gray-500 text-right">
                                {watch("description")?.length || 0}/500
                            </p>
                        </div>

                        {
                            g ? (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all shadow-md ${loading
                                        ? "bg-indigo-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700"
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            Updating Post...
                                            <span className="ml-2 loading loading-spinner loading-sm"></span>
                                        </span>
                                    ) : (
                                        "Update Post"
                                    )}
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all shadow-md ${loading
                                        ? "bg-indigo-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700"
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            Creating Group...
                                            <span className="ml-2 loading loading-spinner loading-sm"></span>
                                        </span>
                                    ) : (
                                        "Publish Group"
                                    )}
                                </motion.button>
                            )
                        }

                    </form>
                </motion.div>
            </motion.div>
        </div>


    )
}

export default Creategroup