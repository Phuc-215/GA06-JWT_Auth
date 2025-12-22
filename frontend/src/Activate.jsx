import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiContext from './ApiContext'

export default function Activate() {
    const api = useContext(ApiContext);
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email) {
            alert("Email is missing. Please register again.");
            return;
        }

        // Submit data to API
        fetch(`${api.url}/auth/activate`, {
            method: 'POST',
            headers: {
                apikey: api.key, 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                otp: otp,
            }),
        }).then(async (result) => {
            if (result.status === 201 || result.status === 200) {
                const json = await result.json();
                console.log('Activate successfully!', json);
                navigate('/login', { replace: true });
            } else {
                alert('Something went wrong! Please try again!');
                console.error(result);
            }
        }).catch(err => {
            console.error("Network error:", err);
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md space-y-6"
        >
            <div className="text-sm text-gray-500 text-center">
                Verifying account for: <strong>{email || "Unknown Email"}</strong>
            </div>

            <label className="block mb-1 font-semibold" htmlFor="otp">
                Enter OTP
            </label>
            
            <input
                id="otp"
                type="text"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                className={`w-full px-3 py-2 border rounded border-gray-300`}
            />
            
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
                Verify
            </button>
        </form>
    );
}