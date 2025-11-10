import React, { useEffect, useState, useMemo } from "react";
import api from "../api";
import ItemCard from "../components/ItemCard";

import BookingModal from "../components/BookingModal";
import { toast } from "react-toastify";

function normalizeText(s = "") {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s\-_]+/g, " ")
    .trim();
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const [filtered, setFiltered] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/items");
        if (!mounted) return;
        const all = Array.isArray(res.data) ? res.data : res.data.items || [];
        setItems(all);
        setFiltered(all);
      } catch (err) {
        console.error("Failed to load items", err);
        toast.error("Failed to load items");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const normQ = useMemo(() => normalizeText(q), [q]);
  const normCategory = useMemo(() => normalizeText(category), [category]);

  useEffect(() => {
    const id = setTimeout(() => {
      const out = items.filter((it) => {
        const fields = [
          it.name,
          it.title,
          it.description,
          it.details,
          it.category,
        ]
          .filter(Boolean)
          .map(normalizeText)
          .join(" ");

        if (normQ && !fields.includes(normQ)) return false;

        if (normCategory) {
          const cat = normalizeText(it.category || "");
          if (!cat.includes(normCategory)) return false;
        }

        if (available === "true" && (!it.quantity || Number(it.quantity) <= 0))
          return false;
        if (available === "false" && it.quantity && Number(it.quantity) > 0)
          return false;

        return true;
      });

      setFiltered(out);
    }, 250);

    return () => clearTimeout(id);
  }, [normQ, normCategory, available, items]);

  const categories = useMemo(() => {
    const s = new Set();
    items.forEach((it) => {
      if (it.category) s.add(it.category);
    });
    return Array.from(s).sort();
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="card-neu p-4">
        <h2 className="text-2xl font-semibold mb-2">
          School Equipment Catalog
        </h2>
        <p className="text-sm text-muted mb-4">
          Browse equipment. Use live search to quickly find what you need.
        </p>

        <div className="flex flex-col md:flex-row gap-3 items-center">
          <input
            type="text"
            placeholder="Search equipment (name, description)..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="p-3 rounded-lg w-full md:flex-1"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 rounded-lg"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={available}
            onChange={(e) => setAvailable(e.target.value)}
            className="p-3 rounded-lg"
          >
            <option value="">Any availability</option>
            <option value="true">Available</option>
            <option value="false">Out of stock</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setQ("");
              setCategory("");
              setAvailable("");
              setFiltered(items);
            }}
            className="px-4 py-2 rounded-lg card-neu"
          >
            Clear
          </button>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-muted">
            No equipment found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onRequest={(i) => setSelected(i)}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <BookingModal
          item={selected}
          onClose={() => setSelected(null)}
          onCreated={() => {
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
