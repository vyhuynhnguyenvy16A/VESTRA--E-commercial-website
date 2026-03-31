import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartService from "../api/cartService";

// ==============================================
// INLINE STYLES
// ==============================================
const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
    opacity: 1,
    transition: "opacity 0.3s ease",
    display: "flex",
    justifyContent: "flex-end", 
  },
  popup: {
    width: "400px",
    maxWidth: "100%",
    height: "100%",
    background: "#fff",
    boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    transform: "translateX(100%)", 
    transition: "transform 0.3s ease-in-out",
  },
  popupOpen: {
    transform: "translateX(0)", 
  },
  header: {
    background: "#ff7e3a", 
    color: "#fff",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { margin: 0, fontSize: "18px", fontWeight: 600 },
  closeBtn: {
    background: "transparent", border: "none", color: "#fff",
    fontSize: "24px", cursor: "pointer", padding: 0,
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  itemCard: {
    display: "flex", gap: "12px", borderBottom: "1px solid #eee", paddingBottom: "16px",
  },
  itemImage: {
    width: "70px", height: "70px", objectFit: "cover", borderRadius: "4px",
    background: "#f3f4f6",
  },
  itemInfo: { flex: 1, display: "flex", flexDirection: "column", gap: "4px" },
  itemName: { margin: 0, fontSize: "14px", fontWeight: 600, color: "#333" },
  itemVariant: { margin: 0, fontSize: "12px", color: "#666" },
  itemPrice: { margin: 0, fontSize: "14px", fontWeight: 700, color: "#ff4500" },
  
  quantityControl: {
    display: "flex", alignItems: "center", gap: "8px", marginTop: "4px",
  },
  qtyBtn: {
    width: "24px", height: "24px", border: "1px solid #ddd", background: "#fff",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: "4px",
  },
  removeBtn: {
    marginLeft: "auto", color: "#ef4444", background: "none", border: "none",
    fontSize: "18px", cursor: "pointer",
  },
  
  footer: {
    padding: "20px", borderTop: "1px solid #eee", background: "#fff",
  },
  totalRow: {
    display: "flex", justifyContent: "space-between", marginBottom: "16px",
    fontWeight: "700", fontSize: "16px",
  },
  btnGroup: { display: "flex", flexDirection: "column", gap: "10px" },
  btnCheckout: {
    width: "100%", padding: "12px", background: "#000", color: "#fff",
    border: "none", borderRadius: "6px", fontWeight: 600, cursor: "pointer",
    textAlign: "center",
  },
  btnViewCart: {
    width: "100%", padding: "12px", background: "#fff", color: "#333",
    border: "1px solid #ccc", borderRadius: "6px", fontWeight: 600, cursor: "pointer",
    textAlign: "center",
  },
  emptyState: {
    textAlign: "center", color: "#999", marginTop: "40px",
  },
  loadingState: {
    textAlign: "center", padding: "20px", color: "#666",
  }
};

export default function CartSidePopup({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.data && res.data.cartItems) {
        setCartItems(res.data.cartItems);
      }
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API mỗi khi mở popup
  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  // Xử lý xóa item
  const handleRemove = async (itemId) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    try {
      await cartService.removeItem(itemId);
      fetchCart(); // Load lại sau khi xóa
    } catch (error) {
      alert("Lỗi khi xóa sản phẩm");
    }
  };

  // Xử lý tăng giảm số lượng
  const handleUpdateQuantity = async (itemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    try {
      await cartService.updateItemQuantity(itemId, newQty);
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQty } : item
      ));
    } catch (error) {
      console.error("Lỗi cập nhật số lượng");
    }
  };

  // Tính tổng tiền
  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (item.variant.price * item.quantity);
  }, 0);

  // Render tên biến thể (Size, Màu) từ mảng values
  const renderVariantInfo = (values) => {
    if (!values || values.length === 0) return "";
    return values.map(v => v.value.value).join(" / ");
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...styles.popup, ...(isOpen ? styles.popupOpen : {}) }}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <h3 style={styles.headerTitle}>Giỏ hàng ({cartItems.length})</h3>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {/* BODY */}
        <div style={styles.body}>
          {loading ? (
            <div style={styles.loadingState}>Đang tải...</div>
          ) : cartItems.length === 0 ? (
            <div style={styles.emptyState}>Giỏ hàng trống</div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} style={styles.itemCard}>
                <img 
                  src={item.variant.product.images?.[0]?.url || "https://via.placeholder.com/70"} 
                  alt="Product" 
                  style={styles.itemImage} 
                />
                
                <div style={styles.itemInfo}>
                  <h4 style={styles.itemName}>{item.variant.product.name}</h4>
                  <p style={styles.itemVariant}>{renderVariantInfo(item.variant.values)}</p>
                  <p style={styles.itemPrice}>{item.variant.price.toLocaleString()} đ</p>
                  
                  <div style={styles.quantityControl}>
                    <button 
                      style={styles.qtyBtn} 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                    >-</button>
                    <span style={{fontSize: '14px', minWidth: '20px', textAlign: 'center'}}>{item.quantity}</span>
                    <button 
                      style={styles.qtyBtn}
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                    >+</button>
                    
                    <button style={styles.removeBtn} onClick={() => handleRemove(item.id)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {cartItems.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.totalRow}>
              <span>Tổng cộng:</span>
              <span style={{ color: "#ff4500" }}>{totalAmount.toLocaleString()} đ</span>
            </div>
            <div style={styles.btnGroup}>
              <button 
                style={styles.btnCheckout}
                onClick={() => { onClose(); navigate('/checkout'); }}
              >
                Thanh toán
              </button>
              <button 
                style={styles.btnViewCart}
                onClick={() => { onClose(); navigate('/shopping-bag'); }}
              >
                Xem chi tiết giỏ hàng
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}