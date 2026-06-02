import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

function MainLayout() {
  return (
    <div style={styles.container}>
      <main style={styles.content}>
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#F4F7FF",
  },

  content: {
    padding: 20,
    paddingBottom: 80,
  },
};

export default MainLayout;