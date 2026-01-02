import React from "react";
import { useNavigate } from "react-router-dom"
import api from "@/utils/api"
import { getAccessToken, setAccessToken } from "../services/authService";


const CreateRoom = () => {

    const navigate = useNavigate()

    const create = async (e) => {
        e.preventDefault();

        api.post("/room/create")
            .then( res => {
                console.log("Full Response Data:", res.data);
                const roomID = res.data.room_id;
                navigate(`/room/${roomID}`);
            
            })
            .catch(err => {
                if (err.response) {
                    // The server responded with a status code (400, 401, 500, etc.)
                    console.error("Server Error:", err.response.data);
                } else if (err.request) {
                    // The request was made but no response was received (CORS or Network issue)
                    console.error("Network/CORS Error: No response received from server.");
                } else {
                    // Something happened in setting up the request or in the .then() block
                    console.error("Local Code Error:", err.message);
                }
            });
        
       
    };

    return (
        <div>
    
            hi.
            <button onClick={create}>Create Room</button>
        </div>
    )
}

export default CreateRoom
