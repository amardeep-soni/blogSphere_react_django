import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Flip, ToastContainer } from "react-toastify";

const MainLayout = () => {
    return (
        <div className="bg-gray-50">
            <Header />
            <Outlet />
            <Footer />
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                stacked
                transition={Flip}
            />
        </div>
    );
};

export default MainLayout;