import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../features/profileSlice";
import Loadingscrenn from "../components/Loadingscrenn";


export default function ProfilePage() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth)
    const { data, loading, error } = useSelector((state) => state.profile);
   console.log(data)
    useEffect(() => {
        if (user?.id) {

            dispatch(fetchProfile(user.id));
        }
    }, [user?.id]);

    if (loading) return <Loadingscrenn />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>{data?.name}</h1>
            <p>{data?.bio}</p>
            <img src={data?.avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
        </div>
    );
}
