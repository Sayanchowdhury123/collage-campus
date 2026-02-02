import { motion } from "framer-motion";


const Loadingscrenn = () => {

  

    return (

        <motion.div className="flex flex-col items-center justify-center h-screen bg-black/70 text-base-content"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
        >
            <motion.div className="flex items-center justify-center gap-4"
                initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 100 }}
            >
                
                 
                     <p className="text-lg font-semibold animate-pulse text-white">
                        Loading...<span className="loading text-white loading-spinner loading-sm ml-2"></span>
                    </p>
                

            </motion.div>


        </motion.div>

    )
}


export default Loadingscrenn;