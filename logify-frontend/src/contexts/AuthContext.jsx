import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/api.js";

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        const user = await auth.me(token);
        setUser(user);
      };
      getUser();
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await auth.login({ email, password });
      setToken(response.token);
      if (response.user) {
        setUser(response.user);
      }
      localStorage.setItem("authToken", response.token);
      navigate("/dashboard");
    } catch (error) {
      throw new Error(error.message || "Login failed. Please try again.");
    }
  };
  // for signup we have to cater for the fact that we have a student , internship admin , workplace supervisor and academic supervisor. So we need to have a role field in the signup form and then we can use that to determine which endpoint to call for the signup process. For now we will just use the student signup endpoint for all signups and then we can add the other endpoints later on when we have the backend ready. then for the supervisor signups they have to await approval from the internship admin , then they can be able to login
  //for the student , he / she first receives an otp and can then fill it in and the signup flow will be done
  const studentSignup = async (
    fullName,
    webmail,
    password,
    program,
    yearOfStudy,
  ) => {
    try {
      const response = await auth.studentRequestOTP({
        fullName,
        email: webmail,
        password,
        program,
        yearOfStudy,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || "Signup failed. Please try again.");
    }
  };
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, studentSignup }}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext, AuthProvider };
