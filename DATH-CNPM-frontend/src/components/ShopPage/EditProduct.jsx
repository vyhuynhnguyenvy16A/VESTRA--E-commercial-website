import React, { useState, useEffect } from "react";
import shopOwnerService from "../../api/shopOwnerService";

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 32,
  },
  modal: {
    background: "#f9fafb", borderRadius: 16, width: "100%", height: "100%", maxWidth: "calc(100vw - 64px)", maxHeight: "calc(100vh - 64px)", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", display: "flex", flexDirection: "column",
  },
  content: {
    padding: 24, display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, flex: 1, overflow: "auto",
  },
  leftColumn: { display: "flex", flexDirection: "column", gap: 24 },
  rightColumn: { display: "flex", flexDirection: "column", gap: 24 },
  section: { background: "#fff", borderRadius: 12, padding: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 4, marginTop: 0 },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 },
  formGroup: { display: "flex", flexDirection: "column" },
  label: { fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 8 },
  input: {
    width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", color: "#111827",
  },
  textarea: {
    width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box", color: "#111827", fontFamily: "inherit"
  },
  select: {
    width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, background: "#fff", cursor: "pointer", outline: "none", boxSizing: "border-box", color: "#111827", appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23111827' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
  },
  priceInputWrapper: { display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff" },
  pricePrefix: { padding: "10px 12px", fontSize: 14, color: "#111827", fontWeight: 500 },
  priceInput: { flex: 1, padding: "10px 12px", border: "none", outline: "none", fontSize: 14, color: "#111827", textAlign: "left" },
  stockInput: { width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", color: "#111827" },
  variantTitle: { fontSize: 13, fontWeight: 500, color: "#111827", marginBottom: 12, marginTop: 0 },
  checkboxRow: { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  checkboxItem: { display: "flex", alignItems: "center", gap: 8 },
  checkbox: { width: 16, height: 16, cursor: "pointer", accentColor: "#6366f1" },
  checkboxLabel: { fontSize: 14, color: "#374151", cursor: "pointer", userSelect: "none" },
  colorRow: { display: "flex", gap: 24, flexWrap: "wrap" },
  colorItem: { display: "flex", alignItems: "center", gap: 10 },
  colorCircle: { width: 24, height: 24, borderRadius: "50%", border: "2px solid #e5e7eb", cursor: "pointer", flexShrink: 0 },
  colorLabel: { fontSize: 14, color: "#374151", cursor: "pointer", userSelect: "none" },
  imagePreviewContainer: {
    marginTop: 12, height: 200, background: "#f3f4f6", borderRadius: 12, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #d1d5db"
  },
  imagePreview: { width: "100%", height: "100%", objectFit: "contain" },
  
  // --- Styles cho phần Nhiều ảnh ---
  inputGroup: { display: 'flex', gap: 8 },
  addImageBtn: {
    padding: "0 16px", background: "#e0e7ff", color: "#4f46e5", border: "none", borderRadius: 8,
    fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
  },
  galleryGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16
  },
  imageWrapper: {
    position: "relative", aspectRatio: "1", borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb"
  },
  thumbnail: { width: "100%", height: "100%", objectFit: "cover" },
  removeBtn: {
    position: "absolute", top: 4, right: 4, width: 24, height: 24, borderRadius: "50%",
    background: "rgba(255,255,255,0.9)", color: "#ef4444", border: "none",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  defaultBadge: {
    position: "absolute", bottom: 4, left: 4, padding: "2px 6px", borderRadius: 4,
    background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 10, fontWeight: 600
  },
  emptyGallery: {
    marginTop: 12, height: 100, background: "#f9fafb", borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 13,
    border: "1px dashed #d1d5db"
  },

  footer: {
    padding: "20px 24px", background: "#fff", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
  },
  cancelButton: {
    padding: "10px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
  },
  submitButton: {
    padding: "10px 20px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
  },
};

// ============================================================================
// EDIT PRODUCT MODAL
// ============================================================================
export default function EditProductModal({ isOpen, onClose, onSubmit, product }) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    categoryId: "",
    price: "",
    stockQuantity: "",
    images: [], 
    sizes: { xs: false, s: false, m: false, l: false, xl: false, xxl: false },
    colors: { black: false, white: false, red: false, blue: false },
  });

  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Lấy danh mục khi modal mở
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const response = await shopOwnerService.getCategories();
          setCategories(response.data);
        } catch (error) {
          console.error("Lỗi lấy danh mục:", error);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && product) {
        
        // A. Map ngược Size & Color từ DB về Checkbox UI
        const newSizes = { xs: false, s: false, m: false, l: false, xl: false, xxl: false };
        const newColors = { black: false, white: false, red: false, blue: false };
        
        // Reverse Map cho màu (Tiếng Việt -> Key)
        const colorReverseMap = { "Đen": "black", "Trắng": "white", "Đỏ": "red", "Xanh": "blue" };

        // Duyệt qua tất cả attributes của sản phẩm để tích vào checkbox
        if (product.attributes) {
            product.attributes.forEach(attr => {
                if (attr.name === "Size") {
                    attr.values.forEach(val => {
                        const key = val.value.toLowerCase();
                        if (newSizes.hasOwnProperty(key)) newSizes[key] = true;
                    });
                }
                if (attr.name === "Màu sắc") {
                    attr.values.forEach(val => {
                        const key = colorReverseMap[val.value];
                        if (key && newColors.hasOwnProperty(key)) newColors[key] = true;
                    });
                }
            });
        }

        // B. Tính tổng kho từ các variants
        const totalStock = product.variants 
            ? product.variants.reduce((sum, v) => sum + v.stock, 0) 
            : 0;

        // C. Lấy giá từ variant đầu tiên (giả định giá chung)
        const price = product.variants && product.variants.length > 0 
            ? product.variants[0].price 
            : "";

        // D. Set dữ liệu vào form
        setFormData({
            name: product.name || "",
            sku: (product.variants && product.variants.length > 0 && product.variants[0].sku) 
     ? product.variants[0].sku.split('-')[0] 
     : "", // Lấy base SKU
            description: product.description || "",
            categoryId: product.categoryId || "",
            price: price,
            stockQuantity: totalStock,
            images: product.images ? product.images.map(img => img.url) : [],
            sizes: newSizes,
            colors: newColors
        });
    }
  }, [isOpen, product]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!currentImageUrl.trim()) return;
    setFormData(prev => ({ ...prev, images: [...prev.images, currentImageUrl.trim()] }));
    setCurrentImageUrl("");
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, index) => index !== indexToRemove) }));
  };

  // --- Logic Submit (Gọi API Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Chuẩn bị Attributes
      const selectedSizes = Object.keys(formData.sizes)
        .filter((key) => formData.sizes[key]).map((s) => s.toUpperCase());
      const selectedColors = Object.keys(formData.colors)
        .filter((key) => formData.colors[key]).map((c) => ({ black: "Đen", white: "Trắng", red: "Đỏ", blue: "Xanh" }[c]));

      const attributes = [];
      if (selectedSizes.length > 0) attributes.push({ name: "Size", values: selectedSizes });
      if (selectedColors.length > 0) attributes.push({ name: "Màu sắc", values: selectedColors });

      // Chuẩn bị Variants
      const variants = [];
      const price = parseFloat(formData.price || 0);
      const stockTotal = parseInt(formData.stockQuantity || 0);
      const baseSku = formData.sku || `PROD-${Date.now()}`;

      // Chia đều kho cho các biến thể
      const addVariant = (opts, suffix) => {
        variants.push({
          price: price, stock: 0, sku: `${baseSku}-${suffix}`.toUpperCase(), options: opts,
        });
      };

      if (selectedSizes.length > 0 && selectedColors.length > 0) {
        selectedSizes.forEach((size) => {
          selectedColors.forEach((color) => addVariant({ Size: size, "Màu sắc": color }, `${size}-${color}`));
        });
      } else if (selectedSizes.length > 0) {
        selectedSizes.forEach((size) => addVariant({ Size: size }, `${size}`));
      } else if (selectedColors.length > 0) {
        selectedColors.forEach((color) => addVariant({ "Màu sắc": color }, `${color}`));
      } else {
        variants.push({ price, stock: stockTotal, sku: baseSku, options: {} });
      }

      if (variants.length > 0) {
          const stockPerItem = Math.floor(stockTotal / variants.length);
          variants.forEach(v => v.stock = stockPerItem);
      }

      // Chuẩn bị Images
      const imagesPayload = formData.images.map((url, index) => ({
          url: url,
          isDefault: index === 0
      }));

      // Payload Update
      const payload = {
        name: formData.name,
        description: formData.description,
        categoryId: parseInt(formData.categoryId) || null,
        images: imagesPayload,
        attributes: attributes,
        variants: variants,
      };

      await shopOwnerService.updateProduct(product.id, payload);

      alert("Cập nhật sản phẩm thành công!");
      if (onSubmit) onSubmit();
      onClose();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.message;
      alert("Lỗi: " + msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={styles.content}>
            <div style={styles.leftColumn}>
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Chỉnh sửa sản phẩm</h3> {/* Đổi tiêu đề */}
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Tên sản phẩm</label>
                    <input type="text" style={styles.input} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Mã SKU</label>
                    <input type="text" style={styles.input} value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Mô tả</label>
                  <textarea style={styles.textarea} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div style={{marginTop: 20}}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Danh mục</label>
                    <select style={styles.select} value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required>
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Giá và Kho</h3>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Giá bán</label>
                    <div style={styles.priceInputWrapper}>
                      <span style={styles.pricePrefix}>₫</span>
                      <input type="number" style={styles.priceInput} value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                    </div>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Tổng tồn kho</label>
                    <input type="number" style={styles.stockInput} value={formData.stockQuantity} onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })} required />
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.rightColumn}>
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Thư viện ảnh</h3>
                <div style={styles.formGroup}>
                    <div style={styles.inputGroup}>
                        <input type="text" placeholder="https://..." style={styles.input} value={currentImageUrl} onChange={(e) => setCurrentImageUrl(e.target.value)} />
                        <button type="button" style={styles.addImageBtn} onClick={handleAddImage}><i className="fas fa-plus"></i> Thêm</button>
                    </div>
                </div>
                {formData.images.length > 0 ? (
                    <div style={styles.galleryGrid}>
                        {formData.images.map((url, index) => (
                            <div key={index} style={styles.imageWrapper}>
                                <img src={url} alt="" style={styles.thumbnail} />
                                <button type="button" style={styles.removeBtn} onClick={() => handleRemoveImage(index)}><i className="fas fa-times"></i></button>
                            </div>
                        ))}
                    </div>
                ) : (<div style={styles.emptyGallery}>Chưa có ảnh nào</div>)}
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Biến thể</h3>
                <p style={styles.variantTitle}>Kích cỡ</p>
                <div style={styles.checkboxRow}>
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <div key={size} style={styles.checkboxItem}>
                      <input type="checkbox" style={styles.checkbox} checked={formData.sizes[size.toLowerCase()]} onChange={(e) => setFormData({ ...formData, sizes: { ...formData.sizes, [size.toLowerCase()]: e.target.checked } })} />
                      <label style={styles.checkboxLabel}>{size}</label>
                    </div>
                  ))}
                </div>
                <p style={styles.variantTitle}>Màu sắc</p>
                <div style={styles.colorRow}>
                  <div style={styles.colorItem}><input type="checkbox" style={styles.checkbox} checked={formData.colors.black} onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, black: e.target.checked } })} /><div style={{ ...styles.colorCircle, background: "#000" }} /><label style={styles.colorLabel}>Đen</label></div>
                  <div style={styles.colorItem}><input type="checkbox" style={styles.checkbox} checked={formData.colors.white} onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, white: e.target.checked } })} /><div style={{ ...styles.colorCircle, background: "#fff" }} /><label style={styles.colorLabel}>Trắng</label></div>
                  <div style={styles.colorItem}><input type="checkbox" style={styles.checkbox} checked={formData.colors.red} onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, red: e.target.checked } })} /><div style={{ ...styles.colorCircle, background: "#dc2626" }} /><label style={styles.colorLabel}>Đỏ</label></div>
                  <div style={styles.colorItem}><input type="checkbox" style={styles.checkbox} checked={formData.colors.blue} onChange={(e) => setFormData({ ...formData, colors: { ...formData.colors, blue: e.target.checked } })} /><div style={{ ...styles.colorCircle, background: "#3b82f6" }} /><label style={styles.colorLabel}>Xanh</label></div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.footer}>
            <button type="button" style={styles.cancelButton} onClick={onClose} disabled={isLoading}>Hủy</button>
            <button type="submit" style={styles.submitButton} disabled={isLoading}>{isLoading ? "Đang lưu..." : "Lưu thay đổi"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}