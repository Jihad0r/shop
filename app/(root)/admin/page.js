"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ProductStore from "../../component/ProductStore";
import ProductFormModal from "../../component/ProductFormModal";


export default function AdminPage() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [editProductData, setEditProductData] = useState(null);

  const { filteredProducts, setProducts, addProduct, updateProduct, deleteProduct } =
    ProductStore();

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
    try {
      const res = await fetch(`/api/products/product/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Delete failed");
      deleteProduct(id);
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={() => {
            setEditProductData(null);
            setShowFormModal(true);
          }}
          className="bg-green-600 text-white cursor-pointer px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts().map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="bg-gray-200"><img src={product.image} alt={product.title} className="h-70 m-auto object-cover" /></div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className={`font-bold ${Number(product.inStock) === 0 ? "text-red-400" : "text-green-400"}`}>{Number(product.inStock) === 0 ? "Out of Stock" : "In Stock"}</p>
                <p className="text-gray-500">{product.category}</p>
                <p className="text-green-600 font-bold mt-2">${product.price}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditProductData(product);
                    setShowFormModal(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 cursor-pointer rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 cursor-pointer rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showFormModal && (
        <ProductFormModal
          initialData={editProductData||{}}
          onSave={handleSaveProduct}
          onClose={() => setShowFormModal(false)}
        />
      )}
    </div>
  );
}
