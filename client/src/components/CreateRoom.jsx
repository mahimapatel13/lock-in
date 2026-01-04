import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"
import api from "@/utils/api"

const CreateRoom = () => {
    const navigate = useNavigate()
    // We use a ref to ensure we don't trigger the API twice in React Strict Mode
    const hasCreated = useRef(false);

    useEffect(() => {
        // Only run if we haven't already attempted to create a room
        if (!hasCreated.current) {
            hasCreated.current = true;
            createRoomAuto();
        }
    }, []);

    const createRoomAuto = async () => {
        api.post("/room/create")
            .then(res => {
                const roomID = res.data.room_id;
                navigate(`/room/${roomID}`);
            })
            .catch(err => {
                if (err.response) {
                    console.error("Server Error:", err.response.data);
                } else {
                    console.error("Error creating room:", err.message);
                }
            });
    };

    return (
        <div className="flex items-center justify-center h-full">
            {/* Display a "Neo-brutalist" loading state since it happens automatically */}
            <div className="p-4 border-4 border-black bg-main shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase italic">
                Initializing Room...
            </div>
        </div>
    )
}

export default CreateRoom