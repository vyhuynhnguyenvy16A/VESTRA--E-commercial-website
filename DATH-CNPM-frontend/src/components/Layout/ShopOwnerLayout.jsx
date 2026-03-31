  // import React from "react";
  // import { useNavigate, useLocation } from "react-router-dom";

  // const styles = {
  //   page: {
  //     display: "flex",
  //     minHeight: "100vh",
  //     fontFamily: "Inter, Arial, sans-serif",
  //     background: "#f3f6fb",
  //   },
  //   sidebar: {
  //     width: 260,
  //     padding: 20,
  //     background: "#fff",
  //     borderRight: "1px solid #eef2f6",
  //     display: "flex",
  //     flexDirection: "column",
  //     gap: 18,
  //   },
  //   logo: {
  //     fontWeight: 700,
  //     fontSize: 20,
  //     color: "#ff6b35",
  //     marginBottom: 4,
  //     cursor: "pointer",
  //   },
  //   logoSub: { fontSize: 11, color: "#9ca3af", marginBottom: 24 },
  //   navItem: {
  //     padding: "10px 12px",
  //     color: "#6b7280",
  //     cursor: "pointer",
  //     borderRadius: 6,
  //     display: "flex",
  //     alignItems: "center",
  //     gap: 10,
  //     fontSize: 14,
  //     transition: "all 0.2s",
  //   },
  //   navItemActive: {
  //     background: "#f3f4f6",
  //     color: "#1f2937",
  //     fontWeight: 500,
  //   },
  //   content: {
  //     flex: 1,
  //     padding: 28,
  //     overflow: "auto",
  //   },
  //   header: {
  //     display: "flex",
  //     justifyContent: "space-between",
  //     alignItems: "center",
  //     marginBottom: 18,
  //   },
  //   userSection: {
  //     display: "flex",
  //     gap: 12,
  //     alignItems: "center",
  //   },
  //   avatar: {
  //     width: 40,
  //     height: 40,
  //     borderRadius: 20,
  //     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  //     cursor: "pointer",
  //   },
  // };

  // export default function ShopOwnerLayout({ children, pageTitle, pageSubtitle }) {
  //   const navigate = useNavigate();
  //   const location = useLocation();

  //   const menuItems = [
  //     {
  //       path: "/shop/dashboard",
  //       icon: "fa-chart-line",
  //       label: "Bảng điều khiển",
  //     },
  //     { path: "/shop/product", icon: "fa-box", label: "Sản phẩm" },
  //     { path: "/shop/order", icon: "fa-shopping-cart", label: "Đơn đặt hàng" },
  //   ];

  //   const isActive = (path) => location.pathname === path;

  //   return (
  //     <div style={styles.page}>
  //       <aside style={styles.sidebar}>
  //         <div style={styles.logo} onClick={() => navigate("/shop/dashboard")}>
  //           VESTRA
  //         </div>
  //         <div style={styles.logoSub}>Chủ cửa hàng</div>
  //         <nav>
  //           {menuItems.map((item) => (
  //             <div
  //               key={item.path}
  //               style={{
  //                 ...styles.navItem,
  //                 ...(isActive(item.path) ? styles.navItemActive : {}),
  //               }}
  //               onClick={() => navigate(item.path)}
  //             >
  //               <i className={`fas ${item.icon}`}></i> {item.label}
  //             </div>
  //           ))}
  //         </nav>
  //       </aside>

  //       <main style={styles.content}>
  //         <div style={styles.header}>
  //           <div>
  //             {pageSubtitle && (
  //               <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
  //                 {pageSubtitle}
  //               </div>
  //             )}
  //             {pageTitle && (
  //               <h1
  //                 style={{
  //                   fontSize: 24,
  //                   fontWeight: 600,
  //                   margin: 0,
  //                   color: "#111827",
  //                 }}
  //               >
  //                 {pageTitle}
  //               </h1>
  //             )}
  //           </div>
  //           <div style={styles.userSection}>
  //             <i
  //               className="fas fa-bell"
  //               style={{ fontSize: 18, cursor: "pointer", color: "#6b7280" }}
  //             ></i>
  //             <div style={{ textAlign: "right" }}>
  //               <div style={{ fontSize: 14, fontWeight: 600 }}>John Smith</div>
  //               <div style={{ fontSize: 12, color: "#9ca3af" }}>Chủ cửa hàng</div>
  //             </div>
  //             <div style={styles.avatar} />
  //           </div>
  //         </div>

  //         {children}
  //       </main>
  //     </div>
  //   );
  // }


import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// [QUAN TRỌNG] Import useAuth để đồng bộ trạng thái đăng nhập/đăng xuất
import { useAuth } from "../../context/AuthContext"; 

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, Arial, sans-serif",
    background: "#f3f6fb",
  },
  sidebar: {
    width: 260,
    padding: 20,
    background: "#fff",
    borderRight: "1px solid #eef2f6",
    display: "flex",
    flexDirection: "column",
    gap: 18,
    position: "sticky",
    top: 0,
    height: "100vh",
  },
  logo: {
    fontWeight: 700,
    fontSize: 20,
    color: "#ff6b35",
    marginBottom: 4,
    cursor: "pointer",
  },
  logoSub: { fontSize: 11, color: "#9ca3af", marginBottom: 24 },
  navContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  navItem: {
    padding: "10px 12px",
    color: "#6b7280",
    cursor: "pointer",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    transition: "all 0.2s",
    marginBottom: 4,
  },
  navItemActive: {
    background: "#f3f4f6",
    color: "#1f2937",
    fontWeight: 500,
  },
  navItemLogout: {
    marginTop: "auto",
    color: "#ef4444",
    borderTop: "1px solid #f3f4f6",
    paddingTop: 16,
  },
  content: {
    flex: 1,
    padding: 28,
    overflow: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  userSection: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
  },
};

export default function ShopOwnerLayout({ children, pageTitle, pageSubtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { logout } = useAuth ? useAuth() : { logout: null }; 

  const [userInfo, setUserInfo] = useState({
    name: "Chủ cửa hàng",
    role: "Shop Owner",
    avatarLetter: "S"
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        

        const displayName = parsedUser.name;
        
        setUserInfo({
          name: displayName,
          role: "Chủ cửa hàng",
          avatarLetter: displayName.charAt(0).toUpperCase()
        });
      } catch (error) {
        console.error("Lỗi đọc dữ liệu user:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      if (logout) {
        logout(); 
      }
      
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }
  };

  const menuItems = [
    {
      path: "/shop/dashboard",
      icon: "fa-chart-line",
      label: "Bảng điều khiển",
    },
    { path: "/shop/product", icon: "fa-box", label: "Sản phẩm" },
    { path: "/shop/order", icon: "fa-shopping-cart", label: "Đơn đặt hàng" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logo} onClick={() => navigate("/shop/dashboard")}>
          VESTRA
        </div>
        <div style={styles.logoSub}>Quản lý cửa hàng</div>
        
        <nav style={styles.navContainer}>
          <div>
            {menuItems.map((item) => (
              <div
                key={item.path}
                style={{
                  ...styles.navItem,
                  ...(isActive(item.path) ? styles.navItemActive : {}),
                }}
                onClick={() => navigate(item.path)}
              >
                <i className={`fas ${item.icon}`} style={{ width: 20, textAlign: 'center' }}></i> 
                {item.label}
              </div>
            ))}
          </div>

          <div 
            style={{ ...styles.navItem, ...styles.navItemLogout }}
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt" style={{ width: 20, textAlign: 'center' }}></i> 
            Đăng xuất
          </div>
        </nav>
      </aside>

      <main style={styles.content}>
        <div style={styles.header}>
          <div>
            {pageSubtitle && (
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
                {pageSubtitle}
              </div>
            )}
            {pageTitle && (
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  margin: 0,
                  color: "#111827",
                }}
              >
                {pageTitle}
              </h1>
            )}
          </div>
          <div style={styles.userSection}>
            <i
              className="fas fa-bell"
              style={{ fontSize: 18, cursor: "pointer", color: "#6b7280" }}
            ></i>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{userInfo.name}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>{userInfo.role}</div>
            </div>
            <div style={styles.avatar}>
              {userInfo.avatarLetter}
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}