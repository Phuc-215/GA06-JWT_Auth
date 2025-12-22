import { useState, useEffect, useContext } from 'react'
import { ClipLoader } from 'react-spinners'
import ApiContext from './ApiContext'

export default function ListOrders() {
  // Load API url and key from context
  const api = useContext(ApiContext);

  const [orders, setOrders] = useState([]);
  const [wards, setWards] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data with province and ward pre-load
    fetch(`${api.url}/orders`, {
      headers: {
        Authorization: api.key,
      },
    }).then(async (result) => {
      if (result.status === 200) {
        setLoading(false);
        setOrders(await result.json());
      } else {
        console.error('Cannot load order data:', result);
      }
    });
  }, [wards, provinces]);

  useEffect(() => {
    fetch(`${api.url}/wards`, {
      headers: {
        Authorization: api.key,
      },
    }).then(async (result) => {
      if (result.status === 200) {
        setLoading(false);
        setWards(await result.json());
      } else {
        console.error('Cannot load ward data:', result);
      }
    });
  }, []);

  useEffect(() => {
    fetch(`${api.url}/provinces`, {
      headers: {
        Authorization: api.key,
      },
    }).then(async (result) => {
      if (result.status === 200) {
        setLoading(false);
        setProvinces(await result.json());
      } else {
        console.error('Cannot load province data:', result);
      }
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-md space-y-6">
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Order List</h2>
        <div className="text-center">
          <ClipLoader color="#000000" loading={loading} size={50} />
        </div>
        <ul className="space-y-4">
          {orders.map((o) => (
            <li className="border p-4 rounded shadow hover:shadow-lg transition">
              <p><span className="font-semibold">Order ID:</span> #{o.id}</p>
              <p><span className="font-semibold">Recipient:</span> {o.recipient}</p>
              <p><span className="font-semibold">Address:</span> {o.houseNumber} {o.street}, {wards.find(w => w.id === o.wardId)?.nameWithType}, {provinces.find(p => p.id === o.provinceId)?.nameWithType}</p>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        // Set page to shipping form
        // onClick={() => setCurrentPage('ShippingForm')}
      >
        Create Order
      </button>
    </div>
  )
}