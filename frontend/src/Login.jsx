import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect, useState } from 'react'
import ApiContext from './ApiContext'
import { useNavigate } from 'react-router-dom';

export default function Login() {
  // Load API url and key from context
  const api = useContext(ApiContext);
  const navigate = useNavigate();

  // Zod schema for validation
  const schema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    // Submit data to API
    fetch(`${api.url}/auth/login`, {
      // Must use POST to submit data
      method: 'POST',
      headers: {
        apikey: api.key,
        // Must be JSON
        'Content-Type': 'application/json',
      },
      // Create JSON from object
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    }).then(async (result) => {
      // 201 => Created
      if (result.status === 200) {
        const json = await result.json()
        console.log('Login successfully!', json);
        // For current load
        api.setKey(json.token);
        // For next page load
        localStorage.setItem('token', json.token);
        navigate('/', { replace: true });
      } else {
        alert('Something went wrong! Please try again!');
        console.error(result);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md space-y-6"
    >
      {/* Email */}
      <div>
        <label className="block mb-1 font-semibold" htmlFor="email">
          Email
        </label>
        <input
          id="recipient"
          type="email"
          {...register('email')}
          className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block mb-1 font-semibold" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className={`w-full px-3 py-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  );
}