import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProfile } from "../features/profileSlice";
import LoadingScreen from "../components/Loadingscrenn";
import { fetchpost } from "../features/PostSlice";
import Card from "../components/Card";

export default function ProfilePage() {
  const {id} = useParams()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data: profile, loading } = useSelector((state) => state.profile);
  const { posts } = useSelector((state) => state.post)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfile(user.id));
      dispatch(fetchpost())
    }
  }, [dispatch, user?.id]);

  if (loading || !profile) return <LoadingScreen />;




  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="">
        <div className="max-w-2xl mx-auto mt-20 ">



          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
          >

            <div className="bg-linear-to-r from-indigo-500 to-purple-600 py-12 flex justify-center">
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                src={profile.image || "/default-avatar.png"}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl"
              />
            </div>


            <div className="px-6 pb-8 pt-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-600 mt-1">{profile.email}</p>
                <div className="flex justify-center space-x-4 mt-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
                    {profile.course} • Sem {profile.semester}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full">
                    Batch {profile.batch}
                  </span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full">
                    {profile.institute}
                  </span>
                </div>
              </div>


              {profile.bio && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Bio</h3>
                  <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                </motion.div>
              )}


              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 rounded-lg p-4 mb-6"
              >
                <p className="text-sm text-gray-500">College ID</p>
                <p className="font-mono text-gray-900">{profile.collegeId}</p>
              </motion.div>

              {
                user.id === profile._id && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/update/profile")}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-md"
                  >
                    Edit Profile
                  </motion.button>
                )
              }

            </div>
          </motion.div>


          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-gray-500 text-2xl font-bold mt-8 mb-8"
          >
            Posts
          </motion.p>
        </div>
      </div>


      <div className="">

        {posts?.length > 0 ? (
          <div className="space-y-6">
            {
              posts?.map((post, i) => (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} key={post._id} >
                  <Card post={post} />
                </motion.div>

              ))
            }
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Be the first to share an update with your group!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/add/post/${gid}`)}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create First Post
            </motion.button>
          </div>
        )}

      </div>
    </div>

  );
}
