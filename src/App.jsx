
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown, ArrowRight, CheckCircle2, Search, ShoppingBag,
  Sparkles, Truck
} from "lucide-react";
import Navbar from "./components/navbar";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import { products } from "./data/products";
import "./index.css";

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Groceries",
  "Beauty",
];

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shopease-cart") || "[]");
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem("shopease-cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch =
        `${product.name} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [search, category, sort]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product) {
    setNotice("");

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) {
          setNotice("You have reached the demo stock limit.");
          return current;
        }

        setNotice(`${product.name} quantity updated.`);
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      setNotice(`${product.name} added to your cart.`);
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function changeQuantity(id, amount) {
    setCart((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          quantity: Math.min(
            item.stock,
            Math.max(1, item.quantity + amount)
          ),
        };
      })
    );
  }

  function removeFromCart(id) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  function checkout() {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderNumber = `DEMO-${Date.now().toString().slice(-8)}`;

    // This is a frontend demonstration, not a real order or payment.
    alert(
      `Demo order successful!\n\nOrder: ${orderNumber}\nTotal: ₹${total}\n\nNo payment was collected.`
    );

    setCart([]);
    setCartOpen(false);
    setNotice(`Demo order ${orderNumber} completed.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              <Sparkles size={15} /> YOUR EVERYDAY SHOPPING PARTNER
            </span>
            <h1>
              Great finds.
              <br />
              <span>Every single day.</span>
            </h1>
            <p>
              Discover electronics, fashion, home essentials and more
              in one convenient place.
            </p>

            <a className="primary-button hero-button" href="#products">
              Start Shopping <ArrowRight size={18} />
            </a>

            <div className="hero-benefits">
              <span><Truck size={17} /> Easy shopping</span>
              <span><ShoppingBag size={17} /> Everyday essentials</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-circle">
              <img
                src="https://placehold.co/600x500/e9e7ff/4835b4?text=ShopEase"
                alt="ShopEase general store"
              />
            </div>
            <div className="floating-tag">
              <Sparkles size={18} />
              <div><strong>Fresh finds</strong><br /><span>All in one place</span></div>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <div><CheckCircle2 /> Easy product browsing</div>
          <div><ShoppingBag /> Simple shopping cart</div>
          <div><Truck /> Demo checkout</div>
        </section>

        <section className="container section" id="products">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE SHOP</span>
              <h2>Explore our products</h2>
              <p>Find something useful for every day.</p>
            </div>
            <span className="product-count">
              {filteredProducts.length} products
            </span>
          </div>

          <div className="filters">
            <div className="search-box">
              <Search size={19} />
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search products"
              />
            </div>

            <div className="sort-box">
              <ArrowDown size={17} />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={`category-chip ${category === item ? "active" : ""}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {notice && (
            <div className="notice" role="status">
              {notice}
              <button onClick={() => setNotice("")} aria-label="Dismiss notice">
                ×
              </button>
            </div>
          )}

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Search size={35} />
              <h3>No products found</h3>
              <p>Try another search or select a different category.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Show all products
              </button>
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <div className="container about-content">
            <span className="eyebrow">ABOUT SHOPEASE</span>
            <h2>One store. Many everyday essentials.</h2>
            <p>
              ShopEase is a student-built e-commerce case study
              demonstrating product discovery, category filtering,
              cart management and responsive web design.
            </p>
            <a href="#products" className="text-link">
              Explore products <ArrowRight size={17} />
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <a className="brand" href="#home">
            <ShoppingBag size={22} /> Shop<span className="brand-accent">Ease</span>
          </a>
          <p>College Case Study Project · Frontend Demo</p>
          <p>© {new Date().getFullYear()} ShopEase</p>
        </div>
      </footer>

      <Cart
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onChangeQuantity={changeQuantity}
        onRemove={removeFromCart}
        onCheckout={checkout}
      />
    </>
  );
}
