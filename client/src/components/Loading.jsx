import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Loading = () => {

    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const nextUrl = query.get("next");
    const navigate = useNavigate();

    useEffect(() => {
        if (nextUrl) {
            setTimeout(() => {
                navigate(`/${nextUrl}`);
            }, 5000);
        }
    }, []);

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="size-14 border-2 border-t-primary rounded-full animate-spin"></div>
        </div>
    )
}

export default Loading