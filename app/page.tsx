"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  location: string;
  contact: string;
  category: string;
  image?: string; // Base64 image string
};

export default function AgroMarketMZ() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    location: "",
    contact: "",
    category: "",
    image: "" as string, // Base64 string
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("agromarket_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Default products if none saved
      const defaultProducts: Product[] = [
        {
          id: "1",
          name: "Corn",
          price: 1500,
          location: "Maputo",
          contact: "841234567",
          category: "Cereals",
          image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449",
        },
        {
          id: "2",
          name: "Rice",
          price: 2000,
          location: "Beira",
          contact: "851234567",
          category: "Cereals",
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
        },
        {
          id: "3",
          name: "Carrots",
          price: 500,
          location: "Nampula",
          contact: "861234567",
          category: "Vegetables",
          image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37",
        },
      ];
      setProducts(defaultProducts);
      localStorage.setItem(
        "agromarket_products",
        JSON.stringify(defaultProducts),
      );
    }
  }, []);

  // Save to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem("agromarket_products", JSON.stringify(products));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = filter ? product.category === filter : true;
      const matchesSearch = search
        ? product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.location.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [products, filter, search]);

  // Handle image upload (file or drag & drop)
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setForm((prev) => ({ ...prev, image: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.price ||
      !form.location ||
      !form.contact ||
      !form.category
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: form.name.trim(),
      price: Number(form.price),
      location: form.location.trim(),
      contact: form.contact.trim(),
      category: form.category,
      image: form.image || undefined,
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Reset form
    setForm({
      name: "",
      price: "",
      location: "",
      contact: "",
      category: "",
      image: "",
    });
    setImagePreview(null);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-3xl">
                🌾
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tighter text-gray-900">
                  AgroMarket <span className="text-green-600">MZ</span>
                </h1>
              </div>
            </div>

            {/* Center Tagline (hidden on small screens) */}
            <p className="hidden text-sm font-medium text-gray-500 md:block">
              Fresh • Local • Direct from Farmers
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 rounded-2xl bg-green-50 px-6 py-3 text-green-700">
              <span className="text-2xl">🌽</span>
              <div>
                <p className="text-xs font-medium">Products Available</p>
                <p className="text-2xl font-semibold tracking-tight">
                  {products.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Products Listing */}
          <div className="lg:col-span-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-semibold text-gray-900">
                Available Products
              </h2>
              <div className="text-sm text-gray-500">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
              </div>
            </div>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
              <input
                type="text"
                placeholder="Search by product name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-lg outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-2xl border border-gray-200 bg-white px-5 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              >
                <option value="">All Categories</option>
                <option value="Cereals">Cereals</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 py-20 text-center">
                <p className="text-xl text-gray-500">No products found.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                          <span className="text-6xl opacity-30">🌾</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-green-700 backdrop-blur">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <h3 className="text-2xl font-semibold text-gray-900">
                          {product.name}
                        </h3>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="text-2xl font-bold text-green-600">
                            {product.price.toLocaleString()} MZN
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3 text-sm text-gray-600">
                        <p className="flex items-center gap-3">
                          📍{" "}
                          <span className="font-medium text-gray-900">
                            Location:
                          </span>{" "}
                          {product.location}
                        </p>
                        <p className="flex items-center gap-3">
                          📞{" "}
                          <span className="font-medium text-gray-900">
                            Contact:
                          </span>{" "}
                          {product.contact}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Product Form */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-100">
              <h2 className="text-3xl font-semibold">List Your Product</h2>
              <p className="mt-2 text-gray-600">Add a new product with photo</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {/* Image Upload Area */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Product Photo (optional)
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                    className={`flex h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
                      isDragging
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    {imagePreview ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="rounded-2xl object-cover"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto mb-3 text-4xl">📸</div>
                        <p className="text-sm text-gray-600">
                          Drag & drop an image or{" "}
                          <span className="text-green-600 underline">
                            click to upload
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Fresh Cassava"
                    className="w-full rounded-2xl border border-gray-200 px-5 py-3 focus:border-green-500 focus:ring-green-200"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Price (MZN)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="1200"
                    className="w-full rounded-2xl border border-gray-200 px-5 py-3 focus:border-green-500 focus:ring-green-200"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="e.g. Maputo, Beira"
                    className="w-full rounded-2xl border border-gray-200 px-5 py-3 focus:border-green-500 focus:ring-green-200"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={form.contact}
                    onChange={(e) =>
                      setForm({ ...form, contact: e.target.value })
                    }
                    placeholder="84 123 4567"
                    className="w-full rounded-2xl border border-gray-200 px-5 py-3 focus:border-green-500 focus:ring-green-200"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-2xl border border-gray-200 px-5 py-3 focus:border-green-500 focus:ring-green-200"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Cereals">Cereals</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white transition hover:bg-green-700 active:bg-green-800"
                >
                  ✅ List Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
