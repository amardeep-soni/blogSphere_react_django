import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
    return (
        <div className="bg-gray-50">
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};

export default MainLayout;