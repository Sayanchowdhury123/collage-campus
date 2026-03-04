import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createResourceSchema, updateResourceSchema } from "../../../backend/src/Validators/ResourceZod";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import api from "../axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const ResourceUpload = () => {
    const location = useLocation()
    const { resource } = location.state || {};
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const [preview, setPreview] = useState(resource?.fileUrl || '');



    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        setValue,
        watch,
        reset
    } = useForm({
        resolver: zodResolver(resource ? updateResourceSchema : createResourceSchema),
        defaultValues: {
            title: '',
            subject: '',
            semester: '',
            course: '',
            description: ''


        }
    });

    useEffect(() => {
        if (resource) {
            reset({
                title: resource?.title || '', description: resource?.description || '', semester: resource?.semester || '',

                course: resource?.course || '', subject: resource?.subject || ''
            });

        }
    }, [resource, reset]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        const fileTypeMap = {
            "application/pdf": "pdf",
            "application/vnd.ms-powerpoint": "ppt",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                "ppt",
            "application/msword": "doc",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "doc",
            "text/plain": "txt",
        };

        const fileType = fileTypeMap[selectedFile.type];
        console.log(fileType)
        if (!fileType) {
            toast.error("not allowed format")
            setFile(null)
            return;
        }



        if (selectedFile) {
            setFile(selectedFile);

            if (selectedFile.type.startsWith('image/')) {
                setPreview(URL.createObjectURL(selectedFile));
            }
        }
    };

  const Submit = async (data) => {
  setLoading(true);
  
  try {
    if (resource) {
     
      if (file) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append('file',file);
        await api.put(`/resource/edit/${resource?._id}`, formData);
      } else {
    
        await api.put(`/resource/edit/${resource?._id}`, data);
      }
      toast.success("Resource updated");
    } else {
     
      const formData = new FormData();
      formData.append('file',file);
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      await api.post("/resource/upload", formData);
      toast.success("Resource uploaded");
    }
    
  
    reset();
    setFile(null);
    setPreview('');
    navigate("/resources");
    
  } catch (error) {
    console.error("Submit error:", error);
    toast.error("Operation failed");
  } finally {
    setLoading(false);
  }
};

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto mt-20">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{resource ? "Update Resource" : "Upload Study Material"}</h1>
                    <p className="mt-2 text-gray-600">
                        Share notes, presentations, and resources with your campus community
                    </p>
                </div>


                <motion.div

                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                >
                    <form onSubmit={handleSubmit(Submit)} className="p-6 space-y-6">


                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Study Material*
                            </label>

                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.png,.jpg,.jpeg"
                                    className="hidden"
                                    id="file-upload"

                                />

                                <label htmlFor="file-upload" className="cursor-pointer">
                                    {preview ? (
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="max-h-32 mx-auto rounded-lg shadow-sm"
                                            />
                                            <p className="mt-3 text-sm text-indigo-600 font-medium">
                                                Change file
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                            <p className="text-lg font-medium text-gray-700 mb-1">
                                                Click to upload
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                PDF, PPT, DOC, TXT, (Max 25MB)
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>


                        <div className="space-y-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title*
                            </label>
                            <input
                                {...register('title')}
                                id="title"
                                type="text"
                                placeholder="e.g., Database Management Systems - Midterm Notes"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                                Course*
                            </label>
                            <input
                                {...register('course')}
                                id="course"
                                type="text"
                                placeholder="e.g., BCA, Computer Science"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            />
                            {errors.course && (
                                <p className="text-sm text-red-500">{errors.course.message}</p>
                            )}
                        </div>


                        <div className="space-y-2">
                            <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                                Semester*
                            </label>
                            <select
                                {...register('semester', { valueAsNumber: true })}
                                id="semester"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgMTIgOCI+PHBhdGggZmlsbD0iIzY2NyIgZD0iTTAuODU0IDQuODU0TDEuNzA3IDQuMDAyTDYuMDAxIDguMjk3bDQuMjk4LTQuMjk1bDAuODU0IDAuODU0TDMuNDQ5IDguNTk5eiIvPjwvc3ZnPg==')] bg-no-repeat bg-right-3"
                            >
                                <option value="">Select semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                            {errors.semester && (
                                <p className="text-sm text-red-500">{errors.semester.message}</p>
                            )}
                        </div>


                        <div className="space-y-2">
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                Subject*
                            </label>
                            <input
                                {...register('subject')}
                                id="subject"
                                type="text"
                                placeholder="e.g., DBMS, Data Structures, Operating Systems"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            />
                            {errors.subject && (
                                <p className="text-sm text-red-500">{errors.subject.message}</p>
                            )}
                        </div>


                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                {...register('description')}
                                id="description"
                                rows="3"
                                placeholder="Brief description of the resource (optional)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </div>


                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg  cursor-pointer font-semibold text-white transition-all shadow-md ${loading
                                ? "bg-indigo-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    {resource ? "Updating Resource" : "Uploading Resource..."}
                                    <span className="ml-2 loading loading-spinner loading-sm"></span>
                                </span>
                            ) : (
                                <span>
                                    {resource ? "Update Resource" : "Upload Resource"}
                                </span>
                            )}
                        </motion.button>
                    </form>
                </motion.div>


                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Supported formats: PDF, PowerPoint, Word, Text, Images</p>
                    <p>Max file size: 25MB</p>
                </div>
            </div>
        </motion.div>
    );
};

export default ResourceUpload;


