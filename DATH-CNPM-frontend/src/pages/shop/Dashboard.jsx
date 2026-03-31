import React from "react";
import ShopOwnerLayout from "../../components/Layout/ShopOwnerLayout";
import { useEffect, useState } from "react";
import shopOwnerService from "../../api/shopOwnerService";
import { Link } from "react-router-dom";


const styles = {
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 18,
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #f3f4f6",

    display: "flex",
    flexDirection: "column",
    alignItems: "center", 
    textAlign: "center",
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    marginBottom: 12,
  },
  cardLabel: { fontSize: 13, color: "#6b7280", marginBottom: 8 },
  cardValue: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
  },
  cardChange: { fontSize: 12, color: "#10b981" },
  chartArea: {
    background: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 18,
  },
  row: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    background: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  small: { color: "#9ca3af", fontSize: 12 },
  badge: {
    padding: "4px 12px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    display: "inline-block", 
    textAlign: "center",     
    minWidth: "80px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  linkText: { fontSize: 13, color: "#6366f1", cursor: "pointer" },
  listContainer: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    border: "1px solid #f3f4f6",
  },
  productThumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    flexShrink: 0,
  },
  productInfo: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: 12,
    alignItems: "center",
    flex: 1,
  },
  productDetails: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  productTitle: {
    fontWeight: 600,
    fontSize: 14,
    color: "#111827",
    margin: 0,
    lineHeight: 1.4,
  },
  productSold: {
    color: "#9ca3af",
    fontSize: 12,
    margin: 0,
    lineHeight: 1.4,
  },
};

function LineChart({ data }) {


  if (!data || data.length === 0) {
      return <div style={{height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af'}}>Chưa có dữ liệu biểu đồ</div>;
  }


  const width = 800;
  const height = 250;
  const paddingX = 40; 
  const paddingY = 40;

  const revenues = data.map(d => d.revenue);
  const maxRevenue = Math.max(...revenues) || 100;
  const points = data.map((item, index) => {
      const x = paddingX + (index / (data.length - 1)) * (width - 2 * paddingX);
     
      const y = (height - paddingY) - (item.revenue / maxRevenue) * (height - 2 * paddingY);
      return { x, y, ...item };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(" ");

  const fillPoints = `
      ${points[0].x},${height - paddingY} 
      ${polylinePoints} 
      ${points[points.length - 1].x},${height - paddingY}
  `;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7b61ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7b61ff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Vùng màu nền */}
      <polygon points={fillPoints} fill="url(#gradientArea)" />

      {/* Đường kẻ chính */}
      <polyline 
        points={polylinePoints} 
        fill="none" 
        stroke="#7b61ff" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Các dấu chấm tròn & Nhãn ngày tháng */}
      {points.map((p, i) => (
        <g key={i}>
            {/* Chấm tròn */}
            <circle 
                cx={p.x} 
                cy={p.y} 
                r="4" 
                fill="#fff" 
                stroke="#7b61ff" 
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
            >
                 <title>{`${new Date(p.date).toLocaleDateString('vi-VN')}: ${p.revenue.toLocaleString()} VND`}</title>
            </circle>

            {/* Nhãn ngày tháng */}
            {(data.length <= 10 || i % Math.ceil(data.length / 7) === 0) && (
                <text 
                    x={p.x} 
                    y={height - 10} 
                    textAnchor="middle" 
                    fontSize="12" 
                    fill="#6b7280"
                >
                    {new Date(p.date).getDate()}/{new Date(p.date).getMonth() + 1}
                </text>
            )}
        </g>
      ))}
    </svg>
  );
}

export default function ShopDashboard() { 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [daysFilter, setDaysFilter] = useState(7);

  const fetchChart = async (days) => {
      try {
          const chartRes = await shopOwnerService.getRevenueChart(days);

          if (chartRes.data && chartRes.data.data) {
              const formattedData = chartRes.data.data.map(item => ({
                  date: item.date,
                  revenue: Number(item.revenue)
              }));
              setChartData(formattedData);
          }
      } catch (error) {
          console.error("Lỗi tải biểu đồ:", error);
      }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsRes = await shopOwnerService.getDashboardStats();
        setData(statsRes.data);

        await fetchChart(daysFilter);

      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
      if (!loading) {
          fetchChart(daysFilter);
      }
  }, [daysFilter]);

  if (loading) {
    return (
        <ShopOwnerLayout pageTitle="Bảng điều khiển">
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
                Đang tải dữ liệu...
            </div>
        </ShopOwnerLayout>
    );
  }

  if (!data || !data.stats) {
    return (
        <ShopOwnerLayout pageTitle="Bảng điều khiển">
            <div style={{ padding: 40, textAlign: "center", color: "#ef4444" }}>
                Không thể tải dữ liệu.
            </div>
        </ShopOwnerLayout>
    );
  }

  const { stats, topSelling, recentOrders } = data;
  
  const getStatusBadgeStyle = (status) => {
    const statusStyles = {
      DELIVERED: { background: "#d1fae5", color: "#065f46" }, // Hoàn thành
      PENDING: { background: "#fef3c7", color: "#92400e" },   // Tạm hoãn
      PROCESSING: { background: "#dbeafe", color: "#1e40af" }, // Đang xử lý
      SHIPPING: { background: "#e9d5ff", color: "#7c3aed" },  // Đang giao
      CANCELLED: { background: "#fee2e2", color: "#991b1b" }  // Đã hủy
    };
    return statusStyles[status] || statusStyles.PROCESSING;
  };

  const renderChange = (value, label = "so với tháng trước") => {
    if (!value) return null;
    
    const isNegative = value.toString().includes('-');
    
    const color = isNegative ? "#ef4444" : "#10b981"; 
    const icon = isNegative ? "▼" : "▲";

    return (
      <div style={{ fontSize: 12, color: color, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span>{icon} {value}</span>
        <span style={{ color: "#6b7280" }}>{label}</span>
      </div>
    );
  };

  const getStatusText = (status) => {
    const statusText = {
      DELIVERED: "Đã giao",
      PENDING: "Chờ duyệt",
      PROCESSING: "Đang xử lý",
      SHIPPING: "Đang giao",
      CANCELLED: "Đã hủy"
    };
    return statusText[status] || status;
  };

  return (
    <ShopOwnerLayout>
      <div style={styles.cards}>
        <div style={styles.card}>
          <div
            style={{
              ...styles.cardIcon,
              background: "#ecfdf5",
              color: "#10b981",
            }}
          >
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div style={styles.cardLabel}>Tổng doanh thu</div>
          <div style={styles.cardValue}>{stats.totalRevenue}</div>
          {renderChange(stats.revenueChange)}
        </div>
        <div style={styles.card}>
          <div
            style={{
              ...styles.cardIcon,
              background: "#dbeafe",
              color: "#3b82f6",
            }}
          >
            <i className="fas fa-shopping-bag"></i>
          </div>
          <div style={styles.cardLabel}>Tổng đơn đặt hàng</div>
          <div style={styles.cardValue}>{stats.totalOrders}</div>
          {renderChange(stats.revenueChange)}
        </div>
        <div style={styles.card}>
          <div
            style={{
              ...styles.cardIcon,
              background: "#fef3c7",
              color: "#f59e0b",
            }}
          >
            <i className="fas fa-box-open"></i>
          </div>
          <div style={styles.cardLabel}>Sản phẩm đang bán</div>
          <div style={styles.cardValue}>{stats.activeProducts}</div>
          <div style={styles.cardChange}>{stats.newProducts} sản phẩm mới</div>
        </div>
        <div style={styles.card}>
          <div
            style={{
              ...styles.cardIcon,
              background: "#fee2e2",
              color: "#ef4444",
            }}
          >
            <i className="fas fa-user-plus"></i>
          </div>
          <div style={styles.cardLabel}>Khách hàng mới</div>
          <div style={styles.cardValue}>{stats.newCustomers}</div>
          {renderChange(stats.customersChange)}
        </div>
      </div>

      <div style={styles.chartArea}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              margin: 0,
              color: "#111827",
            }}
          >
            Doanh thu
          </h3>
          <div style={{ display: "flex", gap: 8 }}>
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDaysFilter(d)}
                style={{
                  padding: "6px 14px",
                  fontSize: 13,
                  borderRadius: 20,
                  border: "1px solid #e5e7eb",
                  background: daysFilter === d ? "#6366f1" : "#fff",
                  color: daysFilter === d ? "#fff" : "#374151",
                  cursor: "pointer",
                  transition: "all .2s",
                  boxShadow:
                    daysFilter === d ? "0 2px 6px rgba(99,102,241,.3)" : "none",
                }}
              >
                {d} ngày
              </button>
            ))}
          </div>

        </div>
        <div style={{ width: "100%", height: 250 }}>
          <LineChart data={chartData} />
        </div>
      </div>

      <div style={styles.row}>
        <div>
          <div style={styles.sectionHeader}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 0,
                color: "#111827",
              }}
            >
              Bán chạy nhất
            </h3>
          </div>
          <div style={styles.listContainer}>
            {topSelling.map((p, i) => (
              <div
                key={ i }
                style={{
                  ...styles.listItem,
                  ...(i === topSelling.length - 1
                    ? { borderBottom: "none", marginBottom: 0 }
                    : {}),
                }}
              >
                <div style={styles.productInfo}>
                  <div
                    style={{
                      ...styles.productThumb,
                      background: ["#fecaca", "#bfdbfe", "#99f6e4", "#fbcfe8"][
                        i % 4
                      ],
                    }}
                  />
                  <div style={styles.productDetails}>
                    <div style={styles.productTitle}>{p.title}</div>
                    <div style={styles.productSold}>Đã bán {p.sold}</div>
                  </div>
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={styles.sectionHeader}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 0,
                color: "#111827",
              }}
            >
              Đơn đặt hàng gần đây
            </h3>
            <Link to="/shop/order" style={styles.linkText}>Xem tất cả</Link>
          </div>
          <div style={styles.listContainer}>
             {recentOrders.length === 0 ? (
                <div style={{padding: 20, textAlign: "center", color: "#9ca3af", fontSize: 13}}>Chưa có đơn hàng nào</div>
            ) : (
                recentOrders.map((o, i) => (
                <div key={o.id || i} style={{ ...styles.listItem, ...(i === recentOrders.length - 1 ? { borderBottom: "none", marginBottom: 0 } : {}) }}>
                    <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{o.name}</div>
                    <div style={styles.small}>#{o.orderNumber}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{o.total}</div>
                        <div style={{ 
                            ...styles.badge, 
                            ...getStatusBadgeStyle(o.status),
                        }}>
                            {getStatusText(o.status)}
                        </div>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>
      </div>
    </ShopOwnerLayout>
  );
}
