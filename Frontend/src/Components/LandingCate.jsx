import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Home, Utensils, Dumbbell, GraduationCap, Wrench, Book, ShoppingBag } from "lucide-react";

const fetchCategories = async () => {
  const { data } = await axios.get("http://localhost:3000/api/v1/posts/categories");
  console.log(data);
  return data;
};

const iconMap = {
  "Real Estate": <Home className="text-blue-600 w-6 h-6" />,
  "Furniture": <Utensils className="text-blue-600 w-6 h-6" />,
  "Electronics": <Dumbbell className="text-blue-600 w-6 h-6" />,
  "Fashion": <GraduationCap className="text-blue-600 w-6 h-6" />,
  "Sports": <Wrench className="text-blue-600 w-6 h-6" />,
  "Books": <Book className="text-blue-600 w-6 h-6" />,
  "Others": <ShoppingBag className="text-blue-600 w-6 h-6" />,
};

const LandingCate = () => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  console.log(categories)

  if (isLoading) return <p className="text-center py-4 text-gray-500">Loading categories...</p>;
  if (error) return <p className="text-center py-4 text-red-500">Error fetching categories</p>;

  return (
    <div className="bg-gray-100 py-6 px-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
            {iconMap[category] || <ShoppingBag className="text-gray-600 w-6 h-6" />}
            <span className="text-gray-700 font-medium">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingCate;
