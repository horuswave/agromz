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
  image?: string;
};

const CATEGORY_ICONS: Record<string, string> = {
  Cereals: "🌾",
  Vegetables: "🥬",
  Fruits: "🍊",
  Others: "🌿",
};

export default function AgroMarketMZ() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    location: "",
    contact: "",
    category: "",
    image: "" as string,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem("agromarket_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
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
    setForm({
      name: "",
      price: "",
      location: "",
      contact: "",
      category: "",
      image: "",
    });
    setImagePreview(null);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

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

  const categories = ["Cereals", "Vegetables", "Fruits", "Others"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --soil: #2C1810;
          --bark: #5C3D2E;
          --clay: #A0522D;
          --wheat: #D4A96A;
          --harvest: #E8C547;
          --sage: #6B7F5E;
          --leaf: #4A7C59;
          --mint: #C8D8C0;
          --cream: #FAF6EF;
          --parchment: #F2EAD8;
          --stone: #9E9488;
          --charcoal: #1C1C1C;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .agro-root {
          font-family: 'DM Sans', sans-serif;
          background-color: var(--cream);
          min-height: 100vh;
          color: var(--charcoal);
        }

        /* ── HEADER ── */
        .agro-header {
          background-color: var(--soil);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid rgba(212,169,106,0.2);
        }

        .agro-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .agro-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .agro-logo-mark {
          width: 36px;
          height: 36px;
          background: var(--harvest);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .agro-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .agro-logo-text span {
          color: var(--harvest);
        }

        .agro-tagline {
          font-size: 0.78rem;
          font-weight: 400;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .agro-stat-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(212,169,106,0.25);
          border-radius: 40px;
          padding: 8px 18px;
        }

        .agro-stat-pill-num {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--harvest);
          line-height: 1;
        }

        .agro-stat-pill-label {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ── HERO STRIP ── */
        .agro-hero {
          background: linear-gradient(135deg, var(--leaf) 0%, var(--sage) 100%);
          padding: 3rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .agro-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 80% 50%, rgba(232,197,71,0.15) 0%, transparent 60%);
        }

        .agro-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .agro-hero h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
          max-width: 480px;
        }

        .agro-hero p {
          margin-top: 0.75rem;
          color: rgba(255,255,255,0.7);
          font-size: 0.95rem;
          max-width: 380px;
        }

        .agro-badge-row {
          display: flex;
          gap: 10px;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .agro-badge {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        /* ── LAYOUT ── */
        .agro-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 3rem;
          align-items: start;
        }

        @media (max-width: 900px) {
          .agro-body { grid-template-columns: 1fr; }
        }

        /* ── TOOLBAR ── */
        .agro-toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .agro-search-wrap {
          flex: 1;
          min-width: 200px;
          position: relative;
        }

        .agro-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          opacity: 0.4;
        }

        .agro-search-wrap input {
          width: 100%;
          padding: 13px 16px 13px 42px;
          border: 1.5px solid #E2D9CC;
          border-radius: 12px;
          background: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: var(--charcoal);
          outline: none;
          transition: border-color 0.2s;
        }

        .agro-search-wrap input:focus { border-color: var(--leaf); }
        .agro-search-wrap input::placeholder { color: #B0A89A; }

        .agro-filter-btn {
          padding: 12px 18px;
          border: 1.5px solid #E2D9CC;
          border-radius: 12px;
          background: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--bark);
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .agro-filter-btn:hover { border-color: var(--leaf); color: var(--leaf); }
        .agro-filter-btn.active {
          background: var(--leaf);
          border-color: var(--leaf);
          color: #fff;
        }

        /* ── SECTION HEADER ── */
        .agro-section-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .agro-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.7rem;
          font-weight: 700;
          color: var(--soil);
        }

        .agro-count {
          font-size: 0.8rem;
          color: var(--stone);
          font-weight: 500;
        }

        /* ── PRODUCT GRID ── */
        .agro-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .agro-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #EDE7DC;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }

        .agro-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(44,24,16,0.12);
        }

        .agro-card-img {
          position: relative;
          height: 200px;
          background: var(--parchment);
          overflow: hidden;
        }

        .agro-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .agro-card:hover .agro-card-img img { transform: scale(1.05); }

        .agro-card-img-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--mint) 0%, #dce8d4 100%);
          font-size: 3.5rem;
          opacity: 0.4;
        }

        .agro-card-cat {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(44,24,16,0.75);
          backdrop-filter: blur(8px);
          color: var(--wheat);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 6px;
        }

        .agro-card-body {
          padding: 20px;
        }

        .agro-card-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .agro-card-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--soil);
          line-height: 1.2;
        }

        .agro-card-price {
          text-align: right;
          flex-shrink: 0;
        }

        .agro-card-price-num {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--leaf);
          line-height: 1;
        }

        .agro-card-price-label {
          font-size: 0.65rem;
          color: var(--stone);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 2px;
        }

        .agro-card-divider {
          height: 1px;
          background: #F0E9DE;
          margin: 14px 0;
        }

        .agro-card-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .agro-card-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--bark);
        }

        .agro-card-meta-icon {
          width: 22px;
          height: 22px;
          background: var(--parchment);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          flex-shrink: 0;
        }

        /* ── EMPTY STATE ── */
        .agro-empty {
          grid-column: 1/-1;
          padding: 5rem 2rem;
          text-align: center;
          border: 2px dashed #E0D5C5;
          border-radius: 16px;
        }

        .agro-empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.4; }
        .agro-empty p { color: var(--stone); font-size: 0.95rem; }

        /* ── FORM PANEL ── */
        .agro-form-panel {
          background: var(--soil);
          border-radius: 20px;
          padding: 2rem;
          position: sticky;
          top: 88px;
        }

        .agro-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }

        .agro-form-sub {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.45);
          margin-top: 4px;
        }

        .agro-form-divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 1.5rem 0;
        }

        .agro-field {
          margin-bottom: 1.1rem;
        }

        .agro-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 6px;
        }

        .agro-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.06);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .agro-input::placeholder { color: rgba(255,255,255,0.25); }
        .agro-input:focus {
          border-color: var(--harvest);
          background: rgba(255,255,255,0.09);
        }

        .agro-input option { background: var(--soil); color: #fff; }

        /* Image upload zone */
        .agro-upload-zone {
          border: 2px dashed rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: rgba(255,255,255,0.03);
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .agro-upload-zone.dragging {
          border-color: var(--harvest);
          background: rgba(232,197,71,0.06);
        }

        .agro-upload-zone:hover {
          border-color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.05);
        }

        .agro-upload-zone img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }

        .agro-upload-text { pointer-events: none; }
        .agro-upload-icon { font-size: 1.8rem; margin-bottom: 8px; opacity: 0.5; }
        .agro-upload-hint { font-size: 0.78rem; color: rgba(255,255,255,0.35); line-height: 1.5; }
        .agro-upload-hint span { color: var(--harvest); }

        /* Submit btn */
        .agro-submit {
          width: 100%;
          padding: 14px;
          background: var(--harvest);
          color: var(--soil);
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-top: 0.5rem;
          letter-spacing: 0.02em;
        }

        .agro-submit:hover { background: #d4b03a; }
        .agro-submit:active { transform: scale(0.98); }

        /* Success toast */
        .agro-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: var(--leaf);
          color: #fff;
          padding: 14px 22px;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 500;
          box-shadow: 0 8px 24px rgba(74,124,89,0.4);
          animation: slideUp 0.3s ease;
          z-index: 9999;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Footer */
        .agro-footer {
          background: var(--soil);
          color: rgba(255,255,255,0.3);
          text-align: center;
          padding: 2rem;
          font-size: 0.78rem;
          letter-spacing: 0.04em;
        }

        .agro-footer span { color: var(--wheat); }
      `}</style>

      <div className="agro-root">
        {/* Header */}
        <header className="agro-header">
          <div className="agro-header-inner">
            <div className="agro-logo">
              <div className="agro-logo-mark">🌾</div>
              <div>
                <div className="agro-logo-text">
                  AgroMarket <span>MZ</span>
                </div>
              </div>
            </div>
            <div className="agro-tagline" style={{ display: "none" }}>
              Fresh · Local · Direct
            </div>
            <div className="agro-stat-pill">
              <div>
                <div className="agro-stat-pill-num">{products.length}</div>
                <div className="agro-stat-pill-label">Listings</div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="agro-hero">
          <div className="agro-hero-inner">
            <h2>Mozambique's Agricultural Marketplace</h2>
            <p>
              Connect directly with farmers. Buy fresh, local produce across all
              provinces.
            </p>
            <div className="agro-badge-row">
              <span className="agro-badge">🌾 Cereals</span>
              <span className="agro-badge">🥬 Vegetables</span>
              <span className="agro-badge">🍊 Fruits</span>
              <span className="agro-badge">🌿 Others</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="agro-body">
          {/* Left: Listings */}
          <div>
            <div className="agro-section-header">
              <h2 className="agro-section-title">Available Products</h2>
              <span className="agro-count">
                {filteredProducts.length} listed
              </span>
            </div>

            {/* Toolbar */}
            <div className="agro-toolbar">
              <div className="agro-search-wrap">
                <span className="agro-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name or location…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                className={`agro-filter-btn ${filter === "" ? "active" : ""}`}
                onClick={() => setFilter("")}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`agro-filter-btn ${filter === cat ? "active" : ""}`}
                  onClick={() => setFilter(filter === cat ? "" : cat)}
                >
                  {CATEGORY_ICONS[cat]} {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="agro-grid">
              {filteredProducts.length === 0 ? (
                <div className="agro-empty">
                  <div className="agro-empty-icon">🌱</div>
                  <p>
                    No products found. Try adjusting your search or filters.
                  </p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product.id} className="agro-card">
                    <div className="agro-card-img">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className="agro-card-img-placeholder">
                          {CATEGORY_ICONS[product.category] || "🌾"}
                        </div>
                      )}
                      <span className="agro-card-cat">{product.category}</span>
                    </div>
                    <div className="agro-card-body">
                      <div className="agro-card-row">
                        <div className="agro-card-name">{product.name}</div>
                        <div className="agro-card-price">
                          <div className="agro-card-price-num">
                            {product.price.toLocaleString()}
                          </div>
                          <div className="agro-card-price-label">MZN</div>
                        </div>
                      </div>
                      <div className="agro-card-divider" />
                      <div className="agro-card-meta">
                        <div className="agro-card-meta-row">
                          <div className="agro-card-meta-icon">📍</div>
                          {product.location}
                        </div>
                        <div className="agro-card-meta-row">
                          <div className="agro-card-meta-icon">📞</div>
                          {product.contact}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <div className="agro-form-panel">
              <div className="agro-form-title">List Your Product</div>
              <div className="agro-form-sub">
                Reach buyers across Mozambique
              </div>
              <div className="agro-form-divider" />

              <form onSubmit={handleSubmit}>
                {/* Image upload */}
                <div className="agro-field">
                  <label className="agro-label">Product Photo</label>
                  <div
                    className={`agro-upload-zone ${isDragging ? "dragging" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        style={{ objectFit: "cover", borderRadius: 10 }}
                      />
                    ) : (
                      <div className="agro-upload-text">
                        <div className="agro-upload-icon">📸</div>
                        <div className="agro-upload-hint">
                          Drag & drop or <span>click to upload</span>
                          <br />
                          PNG, JPG · max 5MB
                        </div>
                      </div>
                    )}
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImageUpload(f);
                      }}
                    />
                  </div>
                </div>

                <div className="agro-field">
                  <label className="agro-label">Product Name *</label>
                  <input
                    className="agro-input"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Fresh Cassava"
                    required
                  />
                </div>

                <div className="agro-field">
                  <label className="agro-label">Price (MZN) *</label>
                  <input
                    className="agro-input"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="1200"
                    required
                  />
                </div>

                <div className="agro-field">
                  <label className="agro-label">Location *</label>
                  <input
                    className="agro-input"
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="e.g. Maputo, Beira"
                    required
                  />
                </div>

                <div className="agro-field">
                  <label className="agro-label">Contact Number *</label>
                  <input
                    className="agro-input"
                    type="text"
                    value={form.contact}
                    onChange={(e) =>
                      setForm({ ...form, contact: e.target.value })
                    }
                    placeholder="84 123 4567"
                    required
                  />
                </div>

                <div className="agro-field">
                  <label className="agro-label">Category *</label>
                  <select
                    className="agro-input"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_ICONS[cat]} {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="agro-submit">
                  List Product →
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="agro-footer">
          <span>AgroMarket MZ</span> · Connecting Mozambican farmers to markets
        </footer>
      </div>

      {/* Toast */}
      {successMsg && (
        <div className="agro-toast">✓ Product listed successfully!</div>
      )}
    </>
  );
}
