import React, { useEffect, useState } from "react";
import Input from "../../../components/javascript/Input";
import Button from "../../../components/javascript/Button";
import { useNavigate } from "react-router-dom";
import "../../css/auth.css";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState("");

  useEffect(() => {
    if (cookies.jwt) {
      if (cookies.jwt === "undefined") {
        removeCookie("jwt");
      } else {
        navigate("/");
      }
    }
  }, [cookies]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const submit = async () => {
    setLoading("button");
    try {
      if (data.email === "") {
        enqueueSnackbar("Email is required", { variant: "error" });
      } else if (data.password === "") {
        enqueueSnackbar("Password is required", { variant: "error" });
      } else {
        const response = await fetch("http://localhost:5000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        });

        if (response.ok) {
          navigate("/chats");
        } else {
          enqueueSnackbar("Invalid Credentials", { variant: "error" });
        }
      }
    } catch (error) {
      enqueueSnackbar("An error occurred during login", { variant: "error" });
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="maincont">
      <section className="leftcont">
        <div className="welcomediv">
          <h1>LC Chat</h1>
          <p>Log into an existing account.</p>
        </div>
        <div>
          <div className="inputdiv">
            <Input
              label="Email"
              value={data.email}
              onchange={handleChange}
              placeholder="Enter your email"
              type="email"
              id="email"
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={data.password}
              onchange={handleChange}
              id="password"
            />
          </div>
        </div>
        <div>
          <div className="buttonsdiv">
            <Button
              loading={loading === "button"}
              text="Login"
              theme="gradient"
              submit={submit}
            />
          </div>
          <div className="leftlastdiv">
            <p>
              Don't have an account ?{" "}
              <span
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
