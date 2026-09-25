import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z.object({
  name: z.string().min(3, "Name must contains at least 3 characters."),
  password: z
    .string()
    .min(8, "password must contains 6 digits")
    .max(20, "password cannot be more than 10 digits")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  email: z.email("Email should be valid"),
});

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Name</label>
          <input
            type="text"
            placeholder="John Doe"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            {...register("name")}
          />
          {errors.name && (
            <p style={{ color: "red", margin: "5px 0 0" }}>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
          <input
            type="text"
            placeholder="example@mail.com"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            {...register("email")}
          />
          {errors.email && (
            <p style={{ color: "red", margin: "5px 0 0" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            {...register("password")}
          />
          {errors.password && (
            <p style={{ color: "red", margin: "5px 0 0" }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{ padding: "10px 15px", cursor: "pointer" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
