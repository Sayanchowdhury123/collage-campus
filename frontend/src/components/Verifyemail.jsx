import { useNavigate, useSearchParams } from "react-router-dom"
import api from "../axios";
import toast from "react-hot-toast";
import { useEffect } from "react";


const Verifyemail = () => {
    const navigate = useNavigate()
    const [searchParam] = useSearchParams();
    const token = searchParam.get("token")
    
  const verify = async () => {
    try {
        const res = await api.get(`/auth/verify?token=${token}`)
        toast.success("email verified")
    } catch (error) {
        console.log(error)
        toast.error("server error")
    }
  }

  useEffect(() => {
  if(!token) return;

   verify()

  },[token])

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="min-w-100   bg-base-300 rounded-sm   text-center">
                <div className="p-10">
                    <p className="text-xl font-semibold">Email verification successfull</p>
                    <button onClick={() => navigate("/login")} className=" btn btn-accent mt-2">Go To Login</button>
                </div>

            </div>
        </div>
    )
}

export default Verifyemail
