import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { data, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

interface RegisterFormData {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setTimeout(() => navigate("/login"), 1000);
    },
    onError: (error: any) => {
      if (error?.response?.data?.detail) {
        const detail = error.response.data.detail;
        const message = Array.isArray(detail)
          ? detail.map((d: any) => d.msg).join("\n")
          : detail;
        setError(message);
      } else {
        alert("An unknown error occurred.");
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);
  //   setSuccess(false);
  //   setLoading(true);

  //   try {
  //     await registerUser(formData);
  //     setSuccess(true);
  //     setTimeout(() => navigate("/login"), 1000);
  //   } catch (error: any) {
  //     let message = "Unknown error occured.";
  //     if (error.response) {
  //       console.error("Register error:", error);
  //       message = error.response.data?.detail || "Registration failed.";
  //     } else if (error.request) {
  //       message = "Server not responding. Please try again later.";
  //     } else {
  //       message = error.message || "Something went wrong.";
  //     }
  //     alert(message);
  //     setError(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Create an Account
        </h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2 rounded text-center"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-2 rounded text-center"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="border p-2 rounded text-center"
          />

          <button
            type="submit"
            disabled={loading}
            className={`py-2 rounded text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {/* {loading ? "Registering..." : "Register"} */}
            {mutation.isPending ? "Registering..." : "Register"}
          </button>
        </div>
        {mutation.isError && <p className="text-red-500 mt-2">{error}</p>}
        {mutation.isSuccess && (
          <p className="text-green-500 mt-2">✅ Registered successfully!</p>
        )}
        {/* {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && (
          <p className="text-green-600 text-center mt-4">
            Registration successful! Redirecting...
          </p>
        )} */}

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
