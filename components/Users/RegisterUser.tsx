"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UsersService } from '@/lib/users';
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState({
    userName: '', // This will be identical to email
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    address: 'Somalia',
    role: 'User',
  });

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        return undefined;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return "Email is required";
        if (!emailRegex.test(value)) return "Enter a valid email";
        return undefined;
      case "password":
        if (value.length < 8) return "Password must be at least 8 characters";
        return undefined;
      case "confirmPassword":
        if (value !== formData.password) return "Passwords do not match";
        return undefined;
      case "phone":
        if (!value.trim()) return "Phone number is required";
        return undefined;
      case "gender":
        if (!value) return "Please select your gender";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Logic: If user types in email, update userName state simultaneously
    if (name === "email") {
      setFormData(prev => ({ 
        ...prev, 
        email: value, 
        userName: value // Backend gets email as userName
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark visible fields as touched
    const visibleFields = ['fullName', 'email', 'phone', 'gender', 'password', 'confirmPassword'];
    const allTouched = visibleFields.reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    const newErrors: FormErrors = {};
    let hasErrors = false;
    visibleFields.forEach((key) => {
      const error = validateField(key, (formData as any)[key]);
      if (error) {
        (newErrors as any)[key] = error;
        hasErrors = true;
      }
    });
    setErrors(newErrors);

    if (hasErrors) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...apiData } = formData;
      const response = await UsersService.create(apiData);
      
      if (response.data.success) {
        toast.success("Account created! Redirecting to login...");
        setTimeout(() => router.push('/auth/login'), 2000);
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (name: string) => {
    const base = "mt-2 w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-1 transition-all";
    if (touched[name] && errors[name as keyof FormErrors]) return `${base} border-red-500 focus:ring-red-500`;
    if (touched[name] && !errors[name as keyof FormErrors]) return `${base} border-[#00bf63] focus:ring-[#00bf63]`;
    return `${base} border-gray-300 focus:border-[#00bf63]`;
  };

  return (
    <section className="bg-gradient-to-br from-[#00bf63]/5 to-white py-16 min-h-screen flex items-center">
      <div className="mx-auto max-w-4xl px-6 w-full">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-[#090044]">Create Your Account</h2>
          <p className="mt-4 text-gray-600">Enter your details below to join our platform.</p>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Full Name */}
              <div className="md:col-span-1">
                <label className="text-sm font-bold text-[#090044] ml-1">Full Name</label>
                <input name="fullName" type="text" className={getInputClass("fullName")} placeholder="Enter your full name" onChange={handleChange} onBlur={handleBlur} />
                {touched.fullName && errors.fullName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.fullName}</p>}
              </div>

              {/* Email (Now also acts as Username behind the scenes) */}
              <div className="md:col-span-1">
                <label className="text-sm font-bold text-[#090044] ml-1">Email Address</label>
                <input name="email" type="email" className={getInputClass("email")} placeholder="Enter your email" onChange={handleChange} onBlur={handleBlur} />
                {touched.email && errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-bold text-[#090044] ml-1">Phone Number</label>
                <input name="phone" type="tel" className={getInputClass("phone")} placeholder="+252..." onChange={handleChange} onBlur={handleBlur} />
                {touched.phone && errors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm font-bold text-[#090044] ml-1">Gender</label>
                <select name="gender" className={getInputClass("gender")} onChange={handleChange} onBlur={handleBlur}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {touched.gender && errors.gender && <p className="text-xs text-red-500 mt-1 ml-1">{errors.gender}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-bold text-[#090044] ml-1">Password</label>
                <input name="password" type="password" className={getInputClass("password")} placeholder="••••••••" onChange={handleChange} onBlur={handleBlur} />
                {touched.password && errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-bold text-[#090044] ml-1">Confirm Password</label>
                <input name="confirmPassword" type="password" className={getInputClass("confirmPassword")} placeholder="••••••••" onChange={handleChange} onBlur={handleBlur} />
                {touched.confirmPassword && errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#00bf63] py-4 text-white font-bold text-lg hover:bg-[#090044] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : (
                  <>Create Account <ArrowRight className="h-5 w-5" /></>
                )}
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm mt-4">
              Already have an account? <a href="/auth/login" className="text-[#00bf63] font-bold hover:underline">Login here</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;