import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

// [UPDATED] Import đúng tên ảnh trong assets
import logoV from "../../assets/vestra_logo.png";
import loginBgImg from "../../assets/Login_png.png";

export default function LoginPage() {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/'); 
      } else {
        setError('root', { type: 'manual', message: 'Email hoặc mật khẩu không đúng' });
      }
    } catch (error) {
      setError('root', { type: 'manual', message: error.message || 'Đã xảy ra lỗi, vui lòng thử lại.' });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Bên trái: Ảnh */}
        <div className="login-image-side">
          <img src={loginBgImg} alt="Login Background" />
        </div>

        {/* Bên phải: Form */}
        <div className="login-form-side">
          <div className="brand-logo-container">
            <img src={logoV} alt="V Logo" className="brand-logo-img" />
          </div>
          
          <h2>Chào mừng trở lại!</h2>
          <p className="subtitle">Vui lòng đăng nhập vào tài khoản của bạn</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            
            <div className="input-group">
              <label>Địa chỉ email</label>
              <div className="input-wrapper">
                 <i className="fa fa-envelope input-icon"></i>
                 <input
                  type="email"
                  {...register("email", { required: "Email là bắt buộc", pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" } })}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <span className="error-text">{errors.email.message}</span>}
            </div>

            <div className="input-group">
              <label>Mật khẩu</label>
              <div className="input-wrapper">
                <i className="fa fa-lock input-icon"></i>
                <input
                  type="password"
                  {...register("password", { required: "Mật khẩu là bắt buộc" })}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <span className="error-text">{errors.password.message}</span>}
            </div>

            
            {errors.root && <div className="error-box">{errors.root.message}</div>}

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            <div className="register-link">
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}