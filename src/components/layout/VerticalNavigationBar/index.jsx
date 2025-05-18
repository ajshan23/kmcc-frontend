import { lazy, Suspense } from "react";
import LogoBox from "@/components/LogoBox";
import SimplebarReactClient from "@/components/wrappers/SimplebarReactClient";
const AppMenu = lazy(() => import("./components/AppMenu"));
import FallbackLoading from "@/components/FallbackLoading";
import { getMenuItems } from "@/helpers/menu";
import { useAuthContext } from "@/context/useAuthContext";
import "./index.css";

const VerticalNavigationBar = () => {
  const { isAdmin } = useAuthContext();

  // Handle both function and boolean isAdmin cases
  const checkIsAdmin = () => {
    return typeof isAdmin === "function" ? isAdmin() : Boolean(isAdmin);
  };

  const menuItems = getMenuItems().filter((item) => {
    if (item.key === "Users") {
      return checkIsAdmin();
    }
    return true;
  });

  return (
    <div className="leftside-menu light-sidebar" id="leftside-menu-container">
      <LogoBox lightMode />

      <SimplebarReactClient data-simplebar className="light-scrollbar">
        <Suspense fallback={<FallbackLoading />}>
          <AppMenu menuItems={menuItems} />
        </Suspense>
      </SimplebarReactClient>
    </div>
  );
};

export default VerticalNavigationBar;
