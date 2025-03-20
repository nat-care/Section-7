import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => navigate("/login")}>Go to Login</button>
      <button onClick={() => navigate("/ProcurementSystem")}>Go to ProcurementSystem</button>
    </div>
  );
};

export default Home;
