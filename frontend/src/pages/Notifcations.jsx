import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../features/SocketSlice';
import Loadingscrenn from '../components/Loadingscrenn';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const Notifications = () => {
  const dispatch = useDispatch();
  const { items, loading, hasMore, initialLoading, page } = useSelector((state) => state.socket);
  const bottomRef = useRef(null);

  
  useEffect(() => {
    dispatch(fetchNotifications({ page: 1 }));
  }, [dispatch]);

 
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          dispatch(fetchNotifications({ page: page + 1 }));
        }
      },
      { threshold: 1.0 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [loading, hasMore, page, dispatch]);


 

  if (initialLoading) return <Loadingscrenn />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto mt-20">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3"
        >
          <FaBell className="text-indigo-600" />
          Notifications
        </motion.h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="text-gray-400 mb-4">
              <FaBell className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-500">You'll see updates here when they arrive</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {items.map((notification) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="shrink-0 mt-0.5">
                      <FaBell className="text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium wrap-break-word">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

      
        <div className="text-center my-6">
          {loading && (
            <span className="loading loading-spinner loading-md text-indigo-600"></span>
          )}
        </div>

      
        {!hasMore && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6"
          >
            <p className="text-gray-500 font-medium">You've seen all notifications</p>
            <p className="text-sm text-gray-400 mt-1">We'll let you know when there's something new</p>
          </motion.div>
        )}

       
        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
};

export default Notifications;
