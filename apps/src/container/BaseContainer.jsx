import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const BaseContainer = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (user) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return (
    <div>
      {outlet}
    </div>
  );
};


export default BaseContainer;