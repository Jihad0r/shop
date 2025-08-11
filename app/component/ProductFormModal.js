import { useState, useEffect } from "react";

export default function ProductFormModal({ initialData = {}, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    inStock: "",
    image: "",
    preview: ""
  });

  useEffect(() => {
    setFormData({
      title: initialData.title || "",
      category: initialData.category || "",
      price: initialData.price || "",
      inStock: initialData.inStock || "",
      description: initialData.description || "",
      
        image: null,
        preview: initialData.image || ""
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
        preview: URL.createObjectURL(files[0])
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-[#000000ba]  bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {initialData && initialData.title ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded-full w-full"
            required
          />
          <div className="flex gap-2">
             <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded-full w-full"
            required
          />
          <input
            type="number"
            name="inStock"
            placeholder="In Stock"
            value={formData.inStock}
            onChange={handleChange}
            className="border p-2 rounded-full w-full"
            required
          />
          </div>
         
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 m-0 h-40 resize-none rounded-2xl w-full"
          />
          <div className="flex gap-2 items-center justify-between">
            <div className="w-1/2"> 
              <select 
                name="category"
                id="category" 
                value={formData.category}
                onChange={handleChange}
                className="border p-2  rounded-full w-full"
                required
              >
                <option value="T-shirt">T-shirts</option>
                <option value="shorts">shorts</option>
                <option value="shoes">shoes</option>
                <option value="coats">coats</option>
                <option value="others">others</option>
              </select>
              <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="border p-2 rounded-full text-white bg-blue-600 w-full"
              />
            </div>
            {formData.preview && (
            <img
              src={formData.preview}
              alt="Preview"
              className="w-32 h-32 object-cover mt-2 rounded"
            />
          )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded-full cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-full cursor-pointer"
            >
              {initialData && initialData.title ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
