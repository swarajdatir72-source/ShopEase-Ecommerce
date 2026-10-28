
import { ShoppingCart, Star } from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductCard({ product, onAdd }) {
  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
        <span className="discount-badge">{discount}% OFF</span>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="rating">
          <Star size={15} fill="currentColor" />
          <span>{product.rating}</span>
          <span className="rating-label">Customer rating</span>
        </div>

        <div className="price-row">
          <strong>{money(product.price)}</strong>
          <del>{money(product.oldPrice)}</del>
        </div>

        <p className="stock-label">
          {product.stock > 0
            ? `${product.stock} available (demo)`
            : "Out of stock"}
        </p>

        <button
          className="add-button"
          onClick={() => onAdd(product)}
          disabled={product.stock < 1}
        >
          <ShoppingCart size={17} />
          Add to Cart
        </button>
      </div>
    </article>
  );
}
