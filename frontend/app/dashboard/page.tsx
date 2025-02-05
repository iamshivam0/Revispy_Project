"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Header from "@/components/header";

interface Category {
  id: string;
  name: string;
  selected: boolean;
}
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DashboardPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

  // Add mounted check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Modify auth check
  useEffect(() => {
    if (mounted) {
      const checkAuth = () => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        setIsAuthenticated(true);
        fetchCategories(currentPage);
      };

      checkAuth();
    }
  }, [mounted]);

  // Remove the token check from the original useEffect
  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories(currentPage);
    }
  }, [currentPage, isAuthenticated]);

  // Update fetchCategories to include auth check
  const fetchCategories = async (page: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/categories?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      // Update selected categories from the complete list
      if (data.selectedCategories) {
        setSelectedCategories(data.selectedCategories);
      }

      // Map categories with their selected state
      const categoriesWithSelection = data.categories.map((cat: Category) => ({
        ...cat,
        selected: data.selectedCategories.includes(cat.name),
      }));

      setCategories(categoriesWithSelection);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        localStorage.removeItem("token");
        router.push("/login");
      }
      setError("Error fetching categories");
      setLoading(false);
    }
  };

  const handleCategoryToggle = async (index: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Update UI immediately
      const newCategories = [...categories];
      newCategories[index].selected = !newCategories[index].selected;
      setCategories(newCategories);

      // Update selected categories
      const newSelectedCategories = newCategories[index].selected
        ? [...selectedCategories, newCategories[index].name]
        : selectedCategories.filter((cat) => cat !== newCategories[index].name);

      setSelectedCategories(newSelectedCategories);

      // Update backend
      const response = await fetch(
        `${API_BASE_URL}/categories/user-preferences`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ categories: newSelectedCategories }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      // Update local storage
      const userDataString = localStorage.getItem("user");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        userData.categories = newSelectedCategories;
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      // Revert UI changes on error
      const newCategories = [...categories];
      newCategories[index].selected = !newCategories[index].selected;
      setCategories(newCategories);
      setError("Error updating preferences");
    }
  };

  // Prevent rendering until mounted
  if (!mounted) {
    return null;
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <Navbar />
      <Header />
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card className="mt-4">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl font-bold">Your Interests</CardTitle>
            <CardDescription>
              Select the categories that interest you the most
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => handleCategoryToggle(index)}
                >
                  <input
                    type="checkbox"
                    checked={category.selected}
                    onChange={() => handleCategoryToggle(index)}
                    className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-900 font-medium">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm rounded-md bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm rounded-md bg-gray-100 disabled:opacity-50"
              >
                Next{" "}
              </button>
            </div>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
