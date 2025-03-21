import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => navigate("/login")}>Go to Login</button>
      <button onClick={() => navigate("/ProcurementSystem")}>Go to ProcurementSystem</button>
      <button onClick={() => navigate("/cardlist")}>Go to CardList</button>
      <button onClick={() => navigate("/selectpages")}>Go to SelectPages</button>
    </div>
  );
};

export default Home;
