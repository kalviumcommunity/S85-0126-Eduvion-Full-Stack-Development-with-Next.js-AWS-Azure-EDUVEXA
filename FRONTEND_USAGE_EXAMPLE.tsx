/**
 * FRONTEND USAGE EXAMPLE - Zod Validation
 * This file demonstrates how to use Zod validation on the frontend
 * with the backend API we created.
 * 
 * Copy these patterns into your actual component files as needed.
 */

// ============================================
// 1. USING ZOD SCHEMA FOR CLIENT-SIDE VALIDATION
// ============================================

import { z } from "zod";
import { userSchema, type UserInput } from "@/lib/schemas/userSchema";

/**
 * Example 1: Direct API call with server-side validation
 */
export async function createUser(userData: UserInput) {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create user");
    }

    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Usage:
// try {
//   const result = await createUser({
//     name: "John",
//     email: "john@example.com",
//     age: 25
//   });
//   console.log("User created:", result.data);
// } catch (error) {
//   console.error("Failed:", error);
// }

// ============================================
// 2. CLIENT-SIDE VALIDATION BEFORE API CALL
// ============================================

export async function createUserWithClientValidation(formData: Record<string, unknown>) {
  try {
    // Validate before sending to server
    const validatedData = userSchema.parse(formData);
    
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errors) {
        // Server-side validation errors
        data.errors.forEach((err: { field: string; message: string }) => {
          console.error(`${err.field}: ${err.message}`);
        });
      }
      throw new Error(data.message || "Failed to create user");
    }

    return data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Client-side validation failed
      error.issues.forEach((issue) => {
        console.error(`${issue.path.join(".")}: ${issue.message}`);
      });
      throw new Error("Validation failed");
    }
    throw error;
  }
}

// ============================================
// 3. REACT COMPONENT EXAMPLE
// ============================================

// import React, { useState } from "react";

// export function UserForm() {
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setErrors({});
//     setLoading(true);

//     const formData = new FormData(e.currentTarget);
//     const data = {
//       name: formData.get("name"),
//       email: formData.get("email"),
//       age: Number(formData.get("age")),
//     };

//     try {
//       await createUserWithClientValidation(data);
//       alert("User created successfully!");
//       e.currentTarget.reset();
//     } catch (error) {
//       setErrors({ submit: String(error) });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {errors.submit && <div className="error">{errors.submit}</div>}
      
//       <input
//         name="name"
//         placeholder="Name (min 2 characters)"
//         required
//       />
//       {errors.name && <span className="error-text">{errors.name}</span>}

//       <input
//         name="email"
//         type="email"
//         placeholder="Email address"
//         required
//       />
//       {errors.email && <span className="error-text">{errors.email}</span>}

//       <input
//         name="age"
//         type="number"
//         placeholder="Age (must be 18+)"
//         required
//       />
//       {errors.age && <span className="error-text">{errors.age}</span>}

//       <button type="submit" disabled={loading}>
//         {loading ? "Creating..." : "Create User"}
//       </button>
//     </form>
//   );
// }
