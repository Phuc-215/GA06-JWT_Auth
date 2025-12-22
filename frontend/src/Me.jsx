import { useState, useEffect, useContext } from 'react'
import { ClipLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom';
import ApiContext from './ApiContext'

export default function ListOrders() {
  // Load API url and key from context
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data with province and ward pre-load
    fetch(`${api.url}/auth/me`, {
      headers: {
        Authorization: `Bearer ${api.key}`,
      },
    }).then(async (result) => {
      setLoading(false);
      if (result.status === 200) {
        setLoading(false);
        setMe(await result.json());
      } else {
        console.error('Cannot load auth data:', result);
      }
    });
  }, []);

  const onClickLogout = () => {
    localStorage.removeItem('token');
    setMe();
  };

  const onClickLogin = () => {
    navigate('/login', { replace: true });
  };

  const onClickRegister = () => {
    navigate('/register', { replace: true });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-md space-y-6">
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Welcome: {me ? me.email : 'Guest'}</h2>
        <div className="text-center">
          <ClipLoader color="#000000" loading={loading} size={50} />
        </div>
        {me && <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={onClickLogout}
        >
          Logout
        </button>}
        {!me && <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={onClickLogin}
        >
          Login
        </button>}
        {!me && <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={onClickRegister}
        >
          Register
        </button>}
      </div>
    </div>
  )
}