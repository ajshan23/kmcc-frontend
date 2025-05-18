import {
  Dropdown,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import avatar1 from "@/assets/images/users/avatar-1.jpg";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useAuthContext } from "@/context/useAuthContext";
import axiosInstance from "../../../../globalFetch/api";
import { use, useEffect, useState } from "react";
import { set } from "react-hook-form";
const ProfileDropdown = () => {
  const { removeSession } = useAuthContext();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", profileImage: "" });

  const handleLoadUserData = async () => {
    const res = await axiosInstance.get("/user/me");
    setUser(res.data.data);
    console.log(res);
  };

  useEffect(() => {
    handleLoadUserData();
    console.log("hoo");
  }, []);
  const logout = () => {
    removeSession();
    navigate("/auth/login");
  };
  return (
    <Dropdown>
      <DropdownToggle
        as="a"
        className="nav-link arrow-none nav-user"
        role="button"
        aria-haspopup="false"
        aria-expanded="false"
      >
        <span className="account-user-avatar">
          <img
            src={user?.profileImage || avatar1}
            alt="user-image"
            width={32}
            className="rounded-circle"
          />
        </span>
        <span className="d-lg-block d-none">
          <h5 className="my-0 fw-normal">
            {user?.name || "User Name"}
            <IconifyIcon
              icon="ri:arrow-down-s-line"
              className="fs-22 d-none d-sm-inline-block align-middle"
            />
          </h5>
        </span>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end dropdown-menu-animated profile-dropdown">
        <DropdownHeader className="noti-title">
          <h6 className="text-overflow m-0">Welcome !</h6>
        </DropdownHeader>

        <DropdownItem onClick={logout}>
          <IconifyIcon
            icon="ri:logout-circle-r-line"
            className="align-middle me-1"
          />
          <span>Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
export default ProfileDropdown;
