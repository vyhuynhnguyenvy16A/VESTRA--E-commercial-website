import React, { useState, useEffect } from "react";
import ShopOwnerLayout from "../../components/Layout/ShopOwnerLayout";
import shopOwnerService from "../../api/shopOwnerService"; // Import Service

// ==============================================
// STYLES
// ==============================================
const styles = {
  // Stats Grid
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 24,
  },
  statCard: {
    background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #f3f4f6",
    display: "flex", flexDirection: "column",
  },
  statTop: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12,
  },
  statLabel: { fontSize: 14, color: "#6b7280", fontWeight: 500 },
  statIcon: {
    width: 44, height: 44, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
  },
  statValue: { fontSize: 32, fontWeight: 700, color: "#111827", lineHeight: 1 },
  
  // Filter Bar
  filterBar: { display: "flex", gap: 12, marginBottom: 24, alignItems: "center" },
  select: {
    padding: "11px 40px 11px 16px", border: "1px solid #e5e7eb", borderRadius: 10,
    fontSize: 14, background: "#fff", cursor: "pointer", outline: "none", appearance: "none",
    fontWeight: 500, color: "#111827",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23111827' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center",
  },
  
  // Table
  tableContainer: { background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "16px 24px", textAlign: "left", fontSize: 14, fontWeight: 600,
    color: "#111827", borderBottom: "1px solid #f3f4f6", background: "#fff", whiteSpace: 'nowrap'
  },
  td: {
    padding: "20px 24px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6", verticalAlign: 'middle'
  },
  
  // Order & Customer Info
  orderId: { color: "#3b82f6", fontWeight: 600, cursor: "pointer" },
  customerInfo: { display: "flex", alignItems: "center", gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: "50%", flexShrink: 0, objectFit: "cover" },
  customerDetails: { display: "flex", flexDirection: "column", gap: 2 },
  customerName: { fontWeight: 600, color: "#111827", fontSize: 14, lineHeight: 1.4 },
  customerEmail: { fontSize: 13, color: "#9ca3af", lineHeight: 1.4 },
  
  // Products
  productList: { display: "flex", flexDirection: "column", gap: 4 },
  productItem: { fontSize: 14, color: "#111827", lineHeight: 1.4 },
  
  price: { fontWeight: 700, color: "#111827", fontSize: 15 },
  
  // Status Select (Trong bảng)
  statusSelect: {
    padding: "8px 32px 8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
    border: "none", cursor: "pointer", outline: "none", appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='currentColor' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
  },
  
  // Pagination
  pagination: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "20px 24px", borderTop: "1px solid #f3f4f6",
  },
  paginationText: { fontSize: 14, color: "#6b7280" },
  paginationButtons: { display: "flex", gap: 8 },
  pageButton: {
    minWidth: 40, height: 40, padding: "0 12px", border: "1px solid #e5e7eb",
    background: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 14,
    fontWeight: 600, color: "#374151", transition: "all 0.2s", display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  pageButtonActive: { background: "#3b82f6", color: "#fff", borderColor: "#3b82f6" },
};

export default function OrderPage() {
  // State lưu dữ liệu API
  const [data, setData] = useState({
    stats: { total: 0, pending: 0, processing: 0, shipping: 0, completed: 0 },
    data: [], // Danh sách orders
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 }
  });

  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [page, setPage] = useState(1);

  // Mapping: Tên hiển thị (UI) <-> Mã trong DB (Enum)
  // Key: Tiếng Việt (UI), Value: Enum (DB)
  const statusMapUiToDb = {
    "Tất cả": "",
    "Tạm hoãn": "PENDING",
    "Đang xử lý": "PROCESSING",
    "Đang giao": "SHIPPING",
    "Hoàn thành": "DELIVERED",
    "Đã hủy": "CANCELLED"
  };

  // Mapping ngược: Enum (DB) -> Tiếng Việt (UI)
  const statusMapDbToUi = {
    "PENDING": "Tạm hoãn",
    "PROCESSING": "Đang xử lý",
    "SHIPPING": "Đang giao",
    "DELIVERED": "Hoàn thành",
    "CANCELLED": "Đã hủy",
    "AWAITING_PAYMENT": "Chờ thanh toán"
  };

  // Hàm gọi API lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Lấy mã status tương ứng để gửi API
      const dbStatus = statusMapUiToDb[statusFilter];
      
      const response = await shopOwnerService.getOrders(page, 10, dbStatus);
      
      if (response.data.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại API khi filter hoặc page thay đổi
  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  // Hàm xử lý khi Shop Owner đổi trạng thái đơn hàng
  const handleUpdateStatus = async (originalId, newStatusUI) => {
    try {
      // Tìm mã Enum tương ứng với text tiếng Việt vừa chọn
      const newStatusEnum = Object.keys(statusMapDbToUi).find(key => statusMapDbToUi[key] === newStatusUI);
      
      if (!newStatusEnum) return;

      if (!window.confirm(`Bạn có chắc muốn chuyển trạng thái đơn hàng sang "${newStatusUI}"?`)) return;

      await shopOwnerService.updateOrderStatus(originalId, newStatusEnum);
      
      alert("Cập nhật trạng thái thành công!");
      fetchOrders(); // Refresh lại bảng
    } catch (error) {
      alert("Lỗi cập nhật: " + (error.response?.data?.message || error.message));
    }
  };

  const { stats, data: orders, pagination } = data;

  // Helper lấy màu sắc cho Badge trạng thái
  const getStatusStyle = (statusUI) => {
    switch (statusUI) {
      case "Tạm hoãn": return { background: "#fef3c7", color: "#92400e" };
      case "Đang xử lý": return { background: "#dbeafe", color: "#1e40af" };
      case "Đang giao": return { background: "#e9d5ff", color: "#7c3aed" };
      case "Hoàn thành": return { background: "#dcfce7", color: "#166534" };
      case "Đã hủy": return { background: "#fee2e2", color: "#991b1b" };
      case "Chờ thanh toán": return { background: "#f3f4f6", color: "#374151" };
      default: return { background: "#f3f4f6", color: "#374151" };
    }
  };

  // Config hiển thị 5 thẻ Stats
  const statsConfig = [
    { label: "Tổng đơn", value: stats.total, icon: "fa-shopping-cart", bgColor: "#dbeafe", iconColor: "#3b82f6", valueColor: "#3b82f6" },
    { label: "Tạm hoãn", value: stats.pending, icon: "fa-clock", bgColor: "#fef3c7", iconColor: "#f59e0b", valueColor: "#f59e0b" },
    { label: "Đang xử lý", value: stats.processing, icon: "fa-cog", bgColor: "#dcfce7", iconColor: "#22c55e", valueColor: "#22c55e" },
    { label: "Đang giao", value: stats.shipping, icon: "fa-truck", bgColor: "#e9d5ff", iconColor: "#a855f7", valueColor: "#a855f7" },
    { label: "Hoàn thành", value: stats.completed, icon: "fa-check-circle", bgColor: "#f3f4f6", iconColor: "#6b7280", valueColor: "#111827" },
  ];

  return (
    <ShopOwnerLayout pageTitle="Đơn đặt hàng" pageSubtitle="Quản lý các đơn đặt hàng">
      
      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        {statsConfig.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statTop}>
              <div style={styles.statLabel}>{stat.label}</div>
              <div style={{ ...styles.statIcon, background: stat.bgColor, color: stat.iconColor }}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
            </div>
            <div style={{ ...styles.statValue, color: stat.valueColor }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <select style={styles.select} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option>Tất cả</option>
          <option>Tạm hoãn</option>
          <option>Đang xử lý</option>
          <option>Đang giao</option>
          <option>Hoàn thành</option>
          <option>Đã hủy</option>
        </select>
      </div>

      {/* Table */}
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
                        <th style={styles.th}>Mã đơn hàng</th>
                        <th style={styles.th}>Khách hàng</th>
                        <th style={styles.th}>Vật phẩm</th>
                        <th style={styles.th}>Giá</th>
                        <th style={styles.th}>Trạng thái</th>
                        <th style={styles.th}>Ngày</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? orders.map((order) => {
                        const currentStatusUI = statusMapDbToUi[order.status] || order.status;

                        return (
                            <tr key={order.id}>
                                <td style={styles.td}>
                                    <span style={styles.orderId}>{order.id}</span>
                                </td>
                                <td style={styles.td}>
                                    <div style={styles.customerInfo}>
                                        <img src={order.customer.avatar} alt="avt" style={styles.avatar} onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
                                        <div style={styles.customerDetails}>
                                            <div style={styles.customerName}>{order.customer.name}</div>
                                            <div style={styles.customerEmail}>{order.customer.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <div style={styles.productList}>
                                        {order.products.map((p, i) => (
                                            <div key={i} style={styles.productItem}>• {p}</div>
                                        ))}
                                    </div>
                                </td>
                                <td style={{...styles.td, ...styles.price}}>{order.price}</td>
                                <td style={styles.td}>
                                    <select
                                        style={{ ...styles.statusSelect, ...getStatusStyle(currentStatusUI) }}
                                        value={currentStatusUI}
                                        onChange={(e) => handleUpdateStatus(order.originalId, e.target.value)}
                                        disabled={order.status === 'CANCELLED'} 
                                    >
                                        <option>Tạm hoãn</option>
                                        <option>Đang xử lý</option>
                                        <option>Đang giao</option>
                                        <option>Hoàn thành</option>
                                        <option>Đã hủy</option>
                                        { !["Tạm hoãn", "Đang xử lý", "Đang giao", "Hoàn thành", "Đã hủy"].includes(currentStatusUI) && 
                                            <option disabled>{currentStatusUI}</option> 
                                        }
                                    </select>
                                </td>
                                <td style={styles.td}>{order.date}</td>
                            </tr>
                        );
                    }) : (
                        <tr><td colSpan="7" style={{padding: 40, textAlign: 'center', color: '#6b7280'}}>Chưa có đơn hàng nào</td></tr>
                    )}
                </tbody>
                </table>

                {/* Pagination */}
                {orders.length > 0 && (
                    <div style={styles.pagination}>
                        <div style={styles.paginationText}>
                            Trang {pagination.currentPage} / {pagination.totalPages} ({pagination.totalItems} đơn)
                        </div>
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
    </ShopOwnerLayout>
  );
}