// src/pages/EditProfilePage.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../features/profileSlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { editProfileZodschema } from "../../../backend/src/Validators/profileValidator";
import Loadingscrenn from "../components/Loadingscrenn";

export default function EditProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { data: profile, loading, error } = useSelector((state) => state.profile);
    const [previewAvatar, setPreviewAvatar] = useState(null);


    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
        watch,
    } = useForm({
        resolver: zodResolver(editProfileZodschema),
        defaultValues: {
            name: "",
            bio: "",
            semester: undefined,
            batch: undefined,
            course: "",
        },
    });


    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || "",
                bio: profile.bio || "",
                semester: profile.semester || undefined,
                batch: profile.batch || undefined,
                course: profile.course || "",
            });
            setPreviewAvatar(profile.image || null);
        }
    }, [profile, reset]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue("image", file);
            const reader = new FileReader();
            reader.onload = () => setPreviewAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        const formData = new FormData();

        formData.append("name", data.name)
        formData.append("semester", data.semester)
        formData.append("batch", data.batch)
        formData.append("bio", data.bio)
        formData.append("course", data.course)

        const avatarFile = watch("image");
        if (avatarFile) {
            formData.append("image", avatarFile);
        }

        const result = await dispatch(updateProfile({ userId: user.id, formData }));

        if (updateProfile.fulfilled.match(result)) {
            toast.success("Profile updated!");
            navigate("/profile");
        } else {
            toast.error(result.payload || "Update failed");
        }
    };

    if (!profile) return <Loadingscrenn />



    return (
        <div>


            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

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
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            {...register("name")}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                    </div>


                    <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <textarea
                            {...register("bio")}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Tell us about yourself"
                        />
                        {errors.bio && <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>}
                    </div>


                    <div>
                        <label className="block text-sm font-medium mb-1">Semester</label>
                        <input
                            {...register("semester", { valueAsNumber: true })}
                            type="number"
                            min="1"
                            max="8"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.semester && <p className="mt-1 text-sm text-red-500">{errors.semester.message}</p>}
                    </div>


                    <div>
                        <label className="block text-sm font-medium mb-1">Batch (Year)</label>
                        <input
                            {...register("batch", { valueAsNumber: true })}
                            type="number"
                            min="2020"
                            max="2030"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.batch && <p className="mt-1 text-sm text-red-500">{errors.batch.message}</p>}
                    </div>


                    <div>
                        <label className="block text-sm font-medium mb-1">Course</label>
                        <input
                            {...register("course")}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. BCA"
                        />
                        {errors.course && <p className="mt-1 text-sm text-red-500">{errors.course.message}</p>}
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
                            {loading ? "Saving..." : "Save Changes"}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>

    );
}
