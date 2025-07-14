import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import HeroImg from "../../assets/hero-img.jpg";
import Logo from "../../assets/invonexus.png";
import { login } from "../../reducers/userReducer";
import { userLogin } from "../../services/services";
import Styles from "./Home.module.css";

const Home = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await userLogin(username, password);
    if (res) {
      toast.success("Login successful");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      dispatch(
        login({
          userID: res.data.userID,
          username: res.data.username,
          token: res.data.token,
        })
      );
      setUsername("");
      setPassword("");
      setIsSubmitting(false);
      navigate("/dashboard");
    } else {
      setIsSubmitting(false);
      toast.error("Login failed");
    }
  };

  return (
    <div className={Styles.homeContainer}>
      <div className={Styles.authContainer}>
        <Box
          className={Styles.authBox}
          component="form"
          noValidate
          autoComplete="off"
        >
          <div className={Styles.brandSection}>
            <img src={Logo} alt="InvoNexus Logo" className={Styles.brandLogo} />
            <div className={Styles.brandContent}>
              <h1 className={Styles.authTitle}>InvoNexus</h1>
              <p className={Styles.authBoxSubTitle}>
                Manage your business invoices with ease and efficiency.
              </p>
            </div>
          </div>

          <div className={Styles.heroContainerOne}>
            <img src={HeroImg} alt="Electronic Document Management" />
          </div>

          <div className={Styles.loginSection}>
            <h2 className={Styles.authBoxTitle}>Welcome Back</h2>

            <div className={Styles.inputGroup}>
              <TextField
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                required
                className={Styles.authInput}
                id="username-input"
                label="Username"
                variant="outlined"
                autoComplete="username"
                placeholder="Enter your username"
              />

              <TextField
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className={Styles.authInput}
                id="password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </div>

            <Button
              disabled={username === "" || password === "" || isSubmitting}
              type="submit"
              onClick={(e) => {
                handleSubmit(e);
              }}
              className={Styles.authButton}
              variant="contained"
              size="large"
            >
              {isSubmitting ? (
                <div className={Styles.loadingContainer}>
                  <ThreeDots
                    height="24"
                    width="24"
                    radius="9"
                    color="currentColor"
                    ariaLabel="three-dots-loading"
                    visible={true}
                  />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </Box>
      </div>
      <div className={Styles.heroContainer}>
        <img src={HeroImg} alt="Electronic Document Management" />
      </div>
    </div>
  );
};

export default Home;
