
import { ShoppingBag, ShoppingCart, Store } from "lucide-react";

export default function Navbar({ cartCount, onCartClick }) {
  return (
    <header className="navbar">
      <a className="brand" href="#home" aria-label="ShopEase home">
        <span className="brand-icon"><Store size={23} /></span>
        <span>Shop<span className="brand-accent">Ease</span></span>
      </a>

      <nav className="nav-links">
        <a href="#home">Home</a>
        <a href="#products">Products</a>
        <a href="#about">About</a>
      </nav>

      <button className="cart-button" onClick={onCartClick}>
        <ShoppingCart size={19} />
        <span>Cart</span>
        <span className="cart-count">{cartCount}</span>
      </button>
    </header>
  );
}
