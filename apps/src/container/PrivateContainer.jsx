import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateContainer = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {outlet}
    </div>
  );
};

export default PrivateContainer;