"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UsersService } from "@/lib/users";

interface UserDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  userName: string;
  role: "User";
  gender: string;
  address: string;
}

export default function ProfilePage() {

  const router = useRouter();

  const [user, setUser] = useState<UserDto | null>(null);
  const [form, setForm] = useState<Partial<UserDto>>({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const loadUser = async () => {

      try {

        const res = await api.get("/auth/me");

        setUser(res.data);
        setForm(res.data);

      } catch (err) {

        console.error("Not authenticated");
        router.push("/auth/login");

      }

    };

    loadUser();

  }, [router]);

  const handleChange = (e: any) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

  };

  const handleSave = async () => {

    if (!user) return;

    try {

      setLoading(true);

      const res = await UsersService.update(
  user.id,
  form
);

      setUser(res.data);
      setForm(res.data);
      setEditing(false);

    } catch (err) {

      console.error("Update failed", err);

    } finally {

      setLoading(false);

    }

  };

  const handleCancel = () => {

    setForm(user || {});
    setEditing(false);

  };

  if (!user) {

    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading profile...
      </div>
    );

  }

  return (

    <section className="min-h-screen bg-gray-50 py-12 px-6">

      <div className="max-w-5xl mx-auto space-y-8">

        {/* PROFILE HEADER */}

        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div className="flex items-center gap-6">

            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#00bf63] shadow">

              <Image
                src="/Images/picture.png"
                alt="avatar"
                fill
                className="object-cover"
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-[#090044]">
                {user.fullName || "User"}
              </h1>

              <p className="text-gray-500">
                {user.email}
              </p>

              <div className="flex gap-2 mt-2">

                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Active Account
                </span>

                <span className="text-xs text-gray-400">
                  ID: {user.id || "-"}
                </span>

              </div>

            </div>

          </div>

          <div className="flex flex-col items-end gap-2">

            <span className="text-sm text-gray-400">
              Account Role
            </span>

            <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              {user.role || "User"}
            </span>

          </div>

        </div>


        {/* PROFILE FORM */}

        <div className="bg-white rounded-2xl shadow p-8">

          <h2 className="text-lg font-semibold text-[#090044] mb-6">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Full Name */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={form.fullName || ""}
                onChange={handleChange}
                disabled={!editing}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00bf63] outline-none disabled:bg-gray-100"
              />

            </div>


            {/* Email */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                disabled={!editing}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00bf63] outline-none disabled:bg-gray-100"
              />

            </div>


            {/* Phone */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                disabled={!editing}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00bf63] outline-none disabled:bg-gray-100"
              />

            </div>


            {/* Gender */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Gender
              </label>

              <select
                name="gender"
                value={form.gender || ""}
                onChange={handleChange}
                disabled={!editing}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00bf63] outline-none disabled:bg-gray-100"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

            </div>


            {/* Role */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Role
              </label>

              <input
                type="text"
                value={user.role || "User"}
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
              />

            </div>


            {/* Address */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                disabled={!editing}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00bf63] outline-none disabled:bg-gray-100"
              />

            </div>

          </div>


          {/* Buttons */}

          <div className="mt-8 flex flex-wrap gap-4">

            {!editing && (

              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2 bg-[#00bf63] text-white rounded-lg hover:bg-green-600 transition"
              >
                Edit Profile
              </button>

            )}

            {editing && (

              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-2 bg-[#090044] text-white rounded-lg hover:bg-[#0d0066]"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </>

            )}

          </div>

        </div>

      </div>

    </section>

  );

}