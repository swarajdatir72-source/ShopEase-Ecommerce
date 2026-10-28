
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function Cart({
  open,
  items,
  onClose,
  onChangeQuantity,
  onRemove,
  onCheckout,
}) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!open) return null;

  return (
    <div className="cart-overlay" onMouseDown={onClose}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="cart-header">
          <div>
            <h2><ShoppingBag size={22} /> Your Cart</h2>
            <p>{items.length} different product(s)</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close cart">
            <X />
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={45} />
              <h3>Your cart is empty</h3>
              <p>Add products to start shopping.</p>
              <button className="primary-button" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <strong>{money(item.price)}</strong>

                  <div className="quantity-controls">
                    <button
                      onClick={() => onChangeQuantity(item.id, -1)}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => onChangeQuantity(item.id, 1)}
                      disabled={item.quantity >= item.stock}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="total-row">
              <span>Subtotal</span>
              <strong>{money(total)}</strong>
            </div>
            <p>Shipping and payment are not included in this demo.</p>
            <button className="primary-button" onClick={onCheckout}>
              Place Demo Order · {money(total)}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
