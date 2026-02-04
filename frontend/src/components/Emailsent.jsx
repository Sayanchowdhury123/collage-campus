import React from 'react'
import { motion } from 'framer-motion'
const Emailsent = () => {

    return (


        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full h-screen flex items-center justify-center">
            <div className="min-w-100   bg-base-300 rounded-sm   text-center">
                <div className="p-10">
                    <p className="text-xl font-semibold">Verification link sent to your email</p>

                </div>

            </div>
        </motion.div>


    )
}

export default Emailsent
