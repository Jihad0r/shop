"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProductStore from "../../component/store/ProductStore";
import ProductFormModal from "../../component/ProductFormModal";
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  DollarSign,
  Tag,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import useAuthStore from "@/app/component/authStore";

export default function AdminPage() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const { filteredProducts, setProducts, addProduct, updateProduct, deleteProduct } =
    ProductStore();
  const { isAdmin, loading } = useAuthStore(); // make sure your store exposes "loading" or something similar
  const router = useRouter();

  // 🔒 Redirect non-admins to home
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/"); // redirect to home
    }
  }, [isAdmin, loading, router]);

  // 🕑 Show loading message while checking
  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Checking permissions...
      </div>
    );
  }

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products/product");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchProducts();
  }, [setProducts]);

  // Save (Add / Update)
  const handleSaveProduct = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("description", data.description);
      formData.append("inStock", data.inStock);
      if (data.image) formData.append("image", data.image);

      let res;
      if (editProductData) {
        res = await fetch(`/api/products/product/${editProductData._id}`, {
          method: "PATCH",
          body: formData,
        });
      } else {
        res = await fetch("/api/products/product", {
          method: "POST",
          body: formData,
        });
      }

      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Something went wrong");

      if (editProductData) {
        updateProduct(result);
        toast.success("Product updated successfully");
      } else {
        addProduct(result);
        toast.success("Product added successfully");
      }

      setShowFormModal(false);
      setEditProductData(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/products/product/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Delete failed");
      deleteProduct(id);
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const products = filteredProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {!showFormModal ? (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">Manage your product inventory</p>
              </div>
              <button
                onClick={() => {
                  setEditProductData(null);
                  setShowFormModal(true);
                }}
                className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 font-semibold"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Add Product
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Products</p>
                    <p className="text-3xl font-bold text-indigo-600 mt-1">{products.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">In Stock</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                      {products.filter((p) => Number(p.inStock) > 0).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
                    <p className="text-3xl font-bold text-red-600 mt-1">
                      {products.filter((p) => Number(p.inStock) === 0).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
              <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-400 mb-2">No products yet</h3>
              <p className="text-gray-400">Get started by adding your first product</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300 flex flex-col"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-56 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      {Number(product.inStock) === 0 ? (
                        <span className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                          <AlertCircle className="w-3 h-3" />
                          Out of Stock
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                          <CheckCircle className="w-3 h-3" />
                          In Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {product.title}
                      </h2>

                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500 font-medium">
                          {product.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                          {product.price}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setEditProductData(product);
                          setShowFormModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={deleteLoading === product._id}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deleteLoading === product._id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        showFormModal && (
          <ProductFormModal
            initialData={editProductData || {}}
            onSave={handleSaveProduct}
            onClose={() => setShowFormModal(false)}
          />
        )
      )}
    </div>
  );
}
