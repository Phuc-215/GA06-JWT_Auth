import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContext, useState } from 'react'; // Thêm useState
import ApiContext from './ApiContext';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // Import ClipLoader

export default function Register({ setCurrentPage }) {
  const api = useContext(ApiContext);
  const navigate = useNavigate();
  
  // Tạo state để theo dõi trạng thái đang tải
  const [isLoading, setIsLoading] = useState(false);

  // Zod schema
  const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }), // Sửa lại cú pháp chuẩn của Zod
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${api.url}/auth/register`, {
        method: 'POST',
        headers: {
          apikey: api.key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (response.status === 201) {
        const json = await response.json();
        console.log('Register successfully!', json);
        navigate('/activate', { replace: true, state: { email: data.email } });
      } else {
        setIsLoading(false);
        alert('Registration failed. Please try again.');
        console.error(response);
      }
    } catch (error) {
      setIsLoading(false);
      alert('Network error. Please check your connection.');
      console.error(error);
    }
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
          id="email"
          type="email"
          {...register('email')}
          // Disable input khi đang loading
          disabled={isLoading} 
          className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'} ${isLoading ? 'bg-gray-100' : ''}`}
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
          // Disable input khi đang loading
          disabled={isLoading}
          className={`w-full px-3 py-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'} ${isLoading ? 'bg-gray-100' : ''}`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Nút Back - QUAN TRỌNG: Đổi type="button" để không bị submit form */}
      <button
        type="button" 
        onClick={() => navigate(-1)}
        disabled={isLoading}
        className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition disabled:opacity-50"
      >
        Back
      </button>

      {/* Nút Register có Loading */}
      <button
        type="submit"
        disabled={isLoading} // Không cho bấm khi đang load
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          // Hiển thị ClipLoader khi đang loading
          <ClipLoader size={24} color="#ffffff" speedMultiplier={0.8} />
        ) : (
          // Hiển thị chữ Register khi bình thường
          "Register"
        )}
      </button>
    </form>
  );
}