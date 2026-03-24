"use client";

import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  location: string;
  contact: string;
  category: string;
};

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Milho",
    price: 1500,
    location: "Maputo",
    contact: "841234567",
    category: "Milho",
  },
  {
    id: "2",
    name: "Arroz",
    price: 2000,
    location: "Beira",
    contact: "851234567",
    category: "Arroz",
  },
  {
    id: "3",
    name: "Tomate",
    price: 500,
    location: "Nampula",
    contact: "861234567",
    category: "Vegetais",
  },
  {
    id: "4",
    name: "Manga",
    price: 800,
    location: "Xai-Xai",
    contact: "871234567",
    category: "Frutas",
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    location: "",
    contact: "",
    category: "",
  });

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.price.trim() ||
      !form.location.trim() ||
      !form.contact.trim() ||
      !form.category.trim()
    ) {
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: form.name.trim(),
      price: Number(form.price),
      location: form.location.trim(),
      contact: form.contact.trim(),
      category: form.category.trim(),
    };

    setProducts((prev) => [newProduct, ...prev]);

    setForm({
      name: "",
      price: "",
      location: "",
      contact: "",
      category: "",
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                Plataforma Agrícola
              </p>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                AgroMarket MZ
              </h1>
              <p className="mt-4 text-base text-gray-600 md:text-lg">
                Uma solução simples para conectar produtores e compradores
                locais em Moçambique, permitindo divulgar produtos, preços,
                localização e contacto num único espaço digital.
              </p>
            </div>

            <div className="rounded-2xl bg-green-600 px-6 py-5 text-white shadow-lg">
              <p className="text-sm opacity-90">Produtos registados</p>
              <p className="text-3xl font-bold">{products.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold">Produtos disponíveis</h2>
              <p className="mt-1 text-sm text-gray-600">
                Consulte as listagens por nome, localização ou categoria.
              </p>
            </div>

            <div className="mb-6 grid gap-3 md:grid-cols-2">
              <input
                type="text"
                placeholder="Pesquisar por produto ou localização"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-600"
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-600"
              >
                <option value="">Todas as categorias</option>
                <option value="Milho">Milho</option>
                <option value="Arroz">Arroz</option>
                <option value="Vegetais">Vegetais</option>
                <option value="Frutas">Frutas</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                Nenhum produto encontrado.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {product.name}
                        </h3>
                        <p className="mt-1 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          {product.category}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">Preço</p>
                        <p className="text-lg font-bold text-green-700">
                          {product.price} MZN
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium text-gray-900">
                          Localização:
                        </span>{" "}
                        {product.location}
                      </p>
                      <p>
                        <span className="font-medium text-gray-900">
                          Contacto:
                        </span>{" "}
                        {product.contact}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold">Adicionar produto</h2>
              <p className="mt-1 text-sm text-gray-600">
                Registe um novo produto agrícola na plataforma.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600"
                  placeholder="Ex.: Batata, Cebola, Feijão"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Preço (MZN)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600"
                  placeholder="Ex.: 1200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Localização
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600"
                  placeholder="Ex.: Maputo, Beira, Nampula"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Contacto
                </label>
                <input
                  type="text"
                  value={form.contact}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, contact: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600"
                  placeholder="Ex.: 84xxxxxxx"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Categoria
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-600"
                >
                  <option value="">Selecionar categoria</option>
                  <option value="Milho">Milho</option>
                  <option value="Arroz">Arroz</option>
                  <option value="Vegetais">Vegetais</option>
                  <option value="Frutas">Frutas</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Adicionar Produto
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
