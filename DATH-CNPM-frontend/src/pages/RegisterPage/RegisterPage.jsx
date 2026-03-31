import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./RegisterPage.css";

import logoV from "../../assets/vestra_logo.png";
import signupBgImg from "../../assets/Register_Png.png";

export default function RegisterPage() {
  const { register: formRegister, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
        const fullName = `${data.firstName} ${data.lastName}`.trim();
        // Gửi data đăng ký
        await registerUser(data.email, data.password, fullName, data.role);
        navigate('/login');
    } catch (error) {
        console.error("Registration failed:", error);
        alert("Đăng ký thất bại: " + error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        
        {/* Bên TRÁI: Form */}
        <div className="register-form-side">
          <div className="reg-brand-logo-container">
            <img src={logoV} alt="V Logo" className="reg-brand-logo-img" />
          </div>
          
          <h3 className="form-title">Tạo tài khoản mới</h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            
            <div className="row-2-col">
              <div className="input-group">
                <label>Họ</label>
                <input
                  type="text"
                  {...formRegister("firstName", { required: "Bắt buộc" })}
                  placeholder="Nguyễn"
                />
                 {errors.firstName && <span className="error-text">{errors.firstName.message}</span>}
              </div>
              <div className="input-group">
                <label>Tên</label>
                <input
                  type="text"
                  {...formRegister("lastName", { required: "Bắt buộc" })}
                  placeholder="Văn A"
                />
                 {errors.lastName && <span className="error-text">{errors.lastName.message}</span>}
              </div>
            </div>

            <div className="input-group">
              <label>Địa chỉ email</label>
              <input
                type="email"
                {...formRegister("email", { 
                  required: "Bắt buộc", 
                  pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" } 
                })}
                placeholder="example@mail.com"
              />
              {errors.email && <span className="error-text">{errors.email.message}</span>}
            </div>

            <div className="input-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                {...formRegister("password", { 
                  required: "Bắt buộc",
                  minLength: { value: 6, message: "Tối thiểu 6 ký tự" } 
                })}
                placeholder="••••••••"
              />
               {errors.password && <span className="error-text">{errors.password.message}</span>}
            </div>

            <div className="input-group">
              <label>Nhập lại mật khẩu</label>
              <input
                type="password"
                {...formRegister("confirmPassword", { 
                  validate: val => val === password || "Mật khẩu không khớp" 
                })}
                placeholder="••••••••"
              />
               {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
            </div>

            <div className="input-group">
              <label>Bạn là?</label>
              <div className="select-wrapper">
                <select {...formRegister("role", { required: "Vui lòng chọn vai trò" })}>
                  <option value="USER">Khách hàng (User)</option>
                  <option value="SHOP">Chủ cửa hàng (Shop Owner)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-register" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Tạo tài khoản"}
            </button>

            <div className="login-redirect">
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </div>
          </form>
        </div>

        {/* Bên PHẢI: Ảnh */}
        <div className="register-image-side">
          <img src={signupBgImg} alt="Register Cover" />
        </div>

      </div>
    </div>
  );
}