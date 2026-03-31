import React, { useState, useEffect, useRef } from "react";
import ShopOwnerLayout from "../../components/Layout/ShopOwnerLayout";
import AddProductModal from "../../components/ShopPage/AddProduct";
import EditProductModal from "../../components/ShopPage/EditProduct";
import shopOwnerService from "../../api/shopOwnerService";

// ==============================================
// STYLES
// ==============================================
const styles = {
  container: { paddingBottom: 40 },
  
  // Filter Area
  filterContainer: {
    display: "flex", flexDirection: "column", gap: 20, marginBottom: 32,
    background: "#fff", padding: 24, borderRadius: 16, border: "1px solid #f3f4f6",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)",
  },
  topFilterRow: { display: "flex", gap: 16, justifyContent: "space-between" },
  searchBox: { flex: 1, position: "relative", maxWidth: 400 },
  searchInput: {
    width: "100%", padding: "12px 16px 12px 44px", border: "1px solid #e5e7eb",
    borderRadius: 10, fontSize: 14, outline: "none", color: "#1f2937", transition: "border 0.2s",
  },
  searchIcon: { position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 16 },
  addButton: {
    padding: "12px 24px", background: "#4f46e5", color: "#fff", border: "none",
    borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s",
  },

  // Custom Dropdown
  dropdownWrapper: { position: "relative", width: 220 },
  dropdownButton: {
    width: "100%", padding: "12px 16px", background: "#fff", border: "1px solid #e5e7eb",
    borderRadius: 10, fontSize: 14, fontWeight: 500, color: "#374151",
    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", userSelect: "none",
  },
  dropdownMenu: {
    position: "absolute", top: "calc(100% + 8px)", left: 0, width: "100%",
    background: "#fff", border: "1px solid #f3f4f6", borderRadius: 12,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", zIndex: 50, overflow: "hidden", padding: 4,
  },
  dropdownItem: {
    padding: "10px 12px", fontSize: 14, color: "#4b5563", cursor: "pointer",
    borderRadius: 8, transition: "background 0.2s", display: "flex", alignItems: "center", gap: 8,
  },

  // Status Tabs
  tabsContainer: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
  tabLabel: { fontSize: 14, fontWeight: 600, color: "#374151", marginRight: 8 },
  tabItem: {
    padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
    cursor: "pointer", border: "1px solid transparent", transition: "all 0.2s",
  },

  // Table
  tableContainer: { background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "16px 24px", textAlign: "left", fontSize: 13, fontWeight: 600,
    color: "#6b7280", background: "#f9fafb", borderBottom: "1px solid #f3f4f6",
    whiteSpace: "nowrap", verticalAlign: "middle"
  },
  td: { padding: "16px 24px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6", verticalAlign: "middle" },
  productInfo: { display: "flex", gap: 12, alignItems: "center" },
  productThumb: { width: 48, height: 48, borderRadius: 8, background: "#f3f4f6", objectFit: "cover" },
  badge: { padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 },
  
  
  // Actions & Pagination
  actions: { display: "flex", gap: 10 },
  iconButton: {
    width: 32, height: 32, border: "none", background: "#f3f4f6", borderRadius: 6,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
  },
  pagination: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "20px 24px", borderTop: "1px solid #f3f4f6",
  },
  paginationText: { fontSize: 14, color: "#6b7280" },
  paginationButtons: { display: "flex", gap: 8 },
  pageButton: {
    minWidth: 36, height: 36, padding: "0 12px", border: "1px solid #e5e7eb",
    background: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 14,
    fontWeight: 500, color: "#374151", display: 'flex', alignItems: 'center',
    justifyContent: 'center', transition: "all 0.2s",
  },
  pageButtonActive: { background: "#4f46e5", color: "#fff", borderColor: "#4f46e5" },
};

// ==============================================
// HELPER COMPONENTS
// ==============================================

const CategoryDropdown = ({ selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await shopOwnerService.getCategories();
        const apiCats = res.data.map(c => ({ label: c.name, value: c.name, icon: "fa-tag" }));
        setCategories([
            { label: "Tất cả danh mục", value: "Tất cả", icon: "fa-layer-group" },
            ...apiCats
        ]);
      } catch (e) {
        setCategories([
            { label: "Tất cả danh mục", value: "Tất cả", icon: "fa-layer-group" },
            { label: "Thời trang Nam", value: "Thời trang Nam", icon: "fa-male" },
            { label: "Thời trang Nữ", value: "Thời trang Nữ", icon: "fa-female" },
        ]);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = categories.find(c => c.value === selected)?.label || "Chọn danh mục";

  return (
    <div style={styles.dropdownWrapper} ref={dropdownRef}>
      <div style={styles.dropdownButton} onClick={() => setIsOpen(!isOpen)}>
        <span style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <i className="fas fa-filter" style={{color: '#6366f1'}}></i> {selectedLabel}
        </span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`} style={{fontSize: 12, color: '#9ca3af'}}></i>
      </div>
      {isOpen && (
        <div style={styles.dropdownMenu}>
          {categories.map((cat) => (
            <div key={cat.value}
              style={{
                ...styles.dropdownItem,
                background: selected === cat.value ? "#eff6ff" : "transparent",
                color: selected === cat.value ? "#4f46e5" : "#4b5563",
              }}
              onClick={() => { onChange(cat.value); setIsOpen(false); }}
              onMouseEnter={(e) => { if (selected !== cat.value) e.currentTarget.style.background = "#f9fafb"; }}
              onMouseLeave={(e) => { if (selected !== cat.value) e.currentTarget.style.background = "transparent"; }}
            >
              <i className={`fas ${cat.icon || 'fa-tag'}`} style={{width: 20, textAlign: 'center'}}></i> {cat.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatusTabs = ({ selected, onChange }) => {
  const statuses = [
    { label: "Tất cả", value: "Tất cả" },
    { label: "Tồn kho", value: "Tồn kho", color: "#22c55e", bg: "#dcfce7" },
    { label: "Sắp hết", value: "Sắp hết", color: "#d97706", bg: "#fef3c7" },
    { label: "Hết hàng", value: "Hết", color: "#dc2626", bg: "#fee2e2" },
  ];

  return (
    <div style={styles.tabsContainer}>
      <span style={styles.tabLabel}>Trạng thái:</span>
      {statuses.map((status) => (
        <div key={status.value} onClick={() => onChange(status.value)}
          style={{
            ...styles.tabItem,
            background: selected === status.value ? (status.bg || '#e0e7ff') : '#f3f4f6',
            color: selected === status.value ? (status.color || '#4f46e5') : '#6b7280',
            border: selected === status.value ? `1px solid ${status.color || '#4f46e5'}` : '1px solid transparent'
          }}
        >
          {status.label}
        </div>
      ))}
    </div>
  );
};

// ==============================================
// MAIN PAGE COMPONENT
// ==============================================

export default function ProductPage() {
  const [data, setData] = useState({
    products: [],
    stats: { totalProducts: 0, inStock: 0, lowStock: 0, outOfStock: 0 },
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 },
  });

  const [loading, setLoading] = useState(false);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");
  const [page, setPage] = useState(1);

  // 1. Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await shopOwnerService.getProducts(
        page, 10, searchTerm, 
        category !== "Tất cả" ? category : "", 
        status !== "Tất cả" ? status : ""
      );
      if (response.data.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => { if (page !== 1) setPage(1); else fetchProducts(); }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter Change
  useEffect(() => { fetchProducts(); }, [page, category, status]);

  // 2. Handlers
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await shopOwnerService.deleteProduct(id);
      alert("Xóa thành công!");
      fetchProducts();
    } catch (error) {
      alert("Xóa thất bại: " + (error.response?.data?.message || "Lỗi server"));
    }
  };

  const handleEditClick = async (productId) => {
      try {
          const response = await shopOwnerService.getProductById(productId);
          setSelectedProduct(response.data);
          setIsEditModalOpen(true);
      } catch (error) {
          alert("Lỗi khi lấy thông tin sản phẩm: " + error.message);
      }
  };

  const handleSuccess = () => {
    fetchProducts(); // Refresh list
  };

  const getStatusBadgeStyle = (statusStr) => {
    switch (statusStr) {
      case "Tồn kho": return { background: "#dcfce7", color: "#166534" };
      case "Sắp hết": return { background: "#fef3c7", color: "#92400e" };
      case "Hết": return { background: "#fee2e2", color: "#991b1b" };
      default: return { background: "#f3f4f6", color: "#374151" };
    }
  };

  const { products, pagination } = data;

  return (
    <ShopOwnerLayout>
      <div style={styles.container}>
        
        {/* FILTER BAR */}
        <div style={styles.filterContainer}>
          <div style={styles.topFilterRow}>
            <div style={styles.searchBox}>
              <i className="fas fa-search" style={styles.searchIcon}></i>
              <input type="text" placeholder="Tìm kiếm..." style={styles.searchInput}
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CategoryDropdown selected={category} onChange={(val) => { setCategory(val); setPage(1); }} />
            <button style={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
              <i className="fas fa-plus"></i> Thêm mới
            </button>
          </div>
          <StatusTabs selected={status} onChange={(val) => { setStatus(val); setPage(1); }} />
        </div>

        {/* TABLE */}
        <div style={styles.tableContainer}>
          {loading ? (
             <div style={{padding: 40, textAlign: 'center', color: '#6b7280'}}>
                <i className="fas fa-spinner fa-spin" style={{marginRight: 10}}></i> Đang tải dữ liệu...
             </div>
          ) : (
            <>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Sản phẩm</th>
                    <th style={styles.th}>Loại</th>
                    <th style={styles.th}>Giá</th>
                    <th style={styles.th}>Tồn kho</th>
                    <th style={styles.th}>Trạng thái</th>
                    <th style={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? products.map((product) => (
                    <tr key={product.id}>
                      <td style={styles.td}>
                        <div style={styles.productInfo}>
                          {product.icon ? <img src={product.icon} alt="" style={styles.productThumb} /> :
                              <div style={{...styles.productThumb, display:'flex', alignItems:'center', justifyContent:'center'}}>
                                  <i className="fas fa-image" style={{color: '#cbd5e1'}}></i>
                              </div>
                          }
                          <div>
                            <div style={{fontWeight: 600, color: '#111827'}}>{product.name}</div>
                            <div style={{fontSize: 12, color: '#9ca3af'}}>{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>{product.category}</td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{product.price}</td>
                      <td style={styles.td}>{product.stock}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, ...getStatusBadgeStyle(product.status) }}>{product.status}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button style={{ ...styles.iconButton, color: "#3b82f6" }} title="Chỉnh sửa" onClick={() => handleEditClick(product.id)}>
                            <i className="fas fa-pen"></i>
                          </button>
                          <button style={{ ...styles.iconButton, color: "#ef4444" }} title="Xóa" onClick={() => handleDelete(product.id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" style={{padding: 40, textAlign: 'center', color: '#6b7280'}}>Không tìm thấy sản phẩm.</td></tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {products.length > 0 && (
                <div style={styles.pagination}>
                  <div style={styles.paginationText}>Trang {pagination.currentPage} / {pagination.totalPages} ({pagination.totalItems} sản phẩm)</div>
                  <div style={styles.paginationButtons}>
                    <button style={{...styles.pageButton, opacity: pagination.currentPage === 1 ? 0.5 : 1}}
                      disabled={pagination.currentPage === 1} onClick={() => setPage(p => p - 1)}>
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button style={{...styles.pageButton, ...styles.pageButtonActive}}>{pagination.currentPage}</button>
                    <button style={{...styles.pageButton, opacity: pagination.currentPage >= pagination.totalPages ? 0.5 : 1}}
                      disabled={pagination.currentPage >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSuccess} 
      />

      {/* Edit Modal */}
      <EditProductModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleSuccess} 
      />

    </ShopOwnerLayout>
  );
}
