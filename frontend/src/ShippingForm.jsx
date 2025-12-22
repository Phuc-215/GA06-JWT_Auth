import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect, useState } from 'react'
import ApiContext from './ApiContext'

export default function ShippingForm({ setCurrentPage }) {
  // Load API url and key from context
  const api = useContext(ApiContext);

  // Empty list provinces and wards
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  // Zod schema for validation
  const schema = z.object({
    recipient: z.string().min(3, 'Recipent is required'),
    houseNumber: z.string().min(1, 'House number is required'),
    street: z.string().min(1, 'Street is required'),
    // Pre-process to number
    province: z.preprocess(val => (typeof val === "string" ? Number(val) : val), z.number()),
    ward: z.preprocess(val => (typeof val === "string" ? Number(val) : val), z.number()),
  });

  // Preload provinces data
  useEffect(() => {
    fetch(`${api.url}/provinces`, {
      headers: {
        apikey: api.key,
      },
    }).then(async (result) => {
      if (result.status === 200) {
        // Update list province
        setProvinces(await result.json());
      } else {
        console.error('Cannot load province data:', result);
      }
    });
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const selectedProvince = watch('province');

  // Update ward when province changes
  useEffect(() => {
    // Reset ward selection
    setValue('ward', '');
    if (selectedProvince && selectedProvince.length > 0) {
      // Filter ward by province id
      fetch(`${api.url}/wards`, {
        headers: {
          apikey: api.key,
        },
      }).then(async (result) => {
        if (result.status === 200) {
          // Update list wards
          setWards(await result.json());
        } else {
          console.error('Cannot load ward data:', result);
        }
      });
    }
  }, [selectedProvince, setValue]);

  const onSubmit = (data) => {
    console.log(data);
    // Submit data to API
    fetch(`${api.url}/orders`, {
      // Must use POST to submit data
      method: 'POST',
      headers: {
        apikey: api.key,
        // Must be JSON
        'Content-Type': 'application/json',
      },
      // Create JSON from object
      body: JSON.stringify({
        recipient: data.recipient,
        houseNumber: data.houseNumber,
        street: data.street,
        provinceId: data.province,
        wardId: data.ward,
      }),
    }).then((result) => {
      // 201 => Created
      if (result.status === 201) {
        alert('Create new shipping order successfully!');
      } else {
        alert('Something went wrong! Check the console!');
        console.error(result);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md space-y-6"
    >
      {/* Recipient */}
      <div>
        <label className="block mb-1 font-semibold" htmlFor="recipient">
          Recipient
        </label>
        <input
          id="recipient"
          type="text"
          {...register('recipient')}
          className={`w-full px-3 py-2 border rounded ${errors.recipient ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.recipient && (
          <p className="text-red-500 text-sm mt-1">{errors.recipient.message}</p>
        )}
      </div>

      {/* House number */}
      <div>
        <label className="block mb-1 font-semibold" htmlFor="houseNumber">
          House Number
        </label>
        <input
          id="houseNumber"
          type="text"
          {...register('houseNumber')}
          className={`w-full px-3 py-2 border rounded ${errors.houseNumber ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.houseNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.houseNumber.message}</p>
        )}
      </div>

      {/* Street */}
      <div>
        <label className="block mb-1 font-semibold" htmlFor="street">
          Street
        </label>
        <input
          id="street"
          type="text"
          {...register('street')}
          className={`w-full px-3 py-2 border rounded ${errors.street ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.street && (
          <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
        )}
      </div>

      {/* Province */}
      <div>
        <label className="block mb-1 font-semibold" htmlFor="province">
          Province
        </label>
        <select
          id="province"
          {...register('province')}
          className={`w-full px-3 py-2 border rounded ${errors.province ? 'border-red-500' : 'border-gray-300'
            }`}
        >
          <option value="">Select province</option>
          {provinces.map(({ id, nameWithType }) => (
            <option key={id} value={id}>
              {nameWithType}
            </option>
          ))}
        </select>
        {errors.province && (
          <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>
        )}
      </div>

      {/* Ward */}
      <div>
        <label className="block mb-1 font-semibold" htmlFor="ward">
          Ward
        </label>
        <select
          id="ward"
          {...register('ward')}
          disabled={!selectedProvince}
          className={`w-full px-3 py-2 border rounded ${errors.ward ? 'border-red-500' : 'border-gray-300'
            }`}
        >
          <option value="">{selectedProvince ? 'Select ward' : 'Select province first'}</option>
          {selectedProvince &&
            wards.filter(w => w.provinceId == selectedProvince).map(({ id, nameWithType }) => (
              <option key={id} value={id}>
                {nameWithType}
              </option>
            ))}
        </select>
        {errors.ward && (
          <p className="text-red-500 text-sm mt-1">{errors.ward.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
        // Set page to home (list order)
        onClick={() => { setCurrentPage('Home') }}
      >
        Back
      </button>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
}