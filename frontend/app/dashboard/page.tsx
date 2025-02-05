"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  selected: boolean;
}

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

  // Add useEffect to fetch user categories on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCategories();
    }
  }, [isAuthenticated]);

  const fetchUserCategories = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/categories/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user categories");
      }

      const data = await response.json();
      setSelectedCategories(data);
    } catch (error) {
      console.error("Error fetching user categories:", error);
      setError("Failed to fetch user categories");
    }
  };

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

      const newCategories = [...categories];
      newCategories[index].selected = !newCategories[index].selected;
      setCategories(newCategories);

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

      const userDataString = localStorage.getItem("user");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        userData.categories = newSelectedCategories;
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      const newCategories = [...categories];
      newCategories[index].selected = !newCategories[index].selected;
      setCategories(newCategories);
      setError("Error updating preferences");
    }
  };

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
    <div className="min-h-screen">
      <Navbar />
      <Header />
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Categories Selection Card */}
        <Card className="mt-4">
          <CardHeader className="border-b flex justify-center text-center">
            <CardTitle className="text-2xl font-bold">
              Please mark your interests!
            </CardTitle>
            <CardDescription>We will keep you notified.</CardDescription>
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
                Next
              </button>
            </div>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
          </CardFooter>
        </Card>

        {/* Selected Categories Card */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Your Selected Categories
            </CardTitle>
            <CardDescription>
              {selectedCategories.length === 0
                ? "You haven't selected any categories yet"
                : `You have selected ${selectedCategories.length} categories`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {selectedCategories.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">
                  Select categories above to see them here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedCategories.map((category) => (
                  <div
                    key={category}
                    className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
