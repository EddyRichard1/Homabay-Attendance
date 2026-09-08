import { useEffect, useState } from "react";
import LeadForm from "./components/LeadForm";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const normalizedPath = currentPath.toLowerCase().replace(/\/$/, "");

  if (normalizedPath === "/admin") {
    return <AdminDashboard />;
  }

  return <LeadForm />;
}

export default App;
