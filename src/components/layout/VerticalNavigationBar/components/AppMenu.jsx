import IconifyIcon from "@/components/wrappers/IconifyIcon";
import {
  findAllParent,
  findMenuItem,
  getMenuItemFromURL,
} from "@/helpers/menu";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";

const MenuItemWithChildren = ({
  item,
  className,
  linkClassName,
  subMenuClassName,
  activeMenuItems,
  toggleMenu,
}) => {
  const [open, setOpen] = useState(activeMenuItems.includes(item.key));
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setOpen(activeMenuItems.includes(item.key));
  }, [activeMenuItems, item]);

  const toggleMenuItem = (e) => {
    e.preventDefault();
    const status = !open;
    setOpen(status);
    if (toggleMenu) toggleMenu(item, status);
    return false;
  };

  const getActiveClass = useCallback(
    (item) => {
      return activeMenuItems?.includes(item.key) ? "active" : "";
    },
    [activeMenuItems]
  );

  return (
    <li
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={toggleMenuItem}
        data-bs-toggle="collapse"
        aria-expanded={open}
        role="button"
        className={clsx(linkClassName, {
          "hover-scale": isHovered,
        })}
      >
        {item.icon && <IconifyIcon icon={item.icon} className="menu-icon" />}
        <span className="ms-2 menu-text">{item.label}</span>
        {!item.badge ? (
          <span className="menu-arrow transition-transform">
            <IconifyIcon
              icon="ri:arrow-drop-right-line"
              width={24}
              height={24}
              className={clsx("arrow-icon", { "rotate-90": open })}
            />
          </span>
        ) : (
          <span
            className={`badge badge-pill text-end bg-${item.badge.variant}`}
          >
            {item.badge.text}
          </span>
        )}
      </div>
      <Collapse in={open}>
        <div className="transition-all duration-300">
          <ul className={clsx(subMenuClassName, "pl-2")}>
            {(item.children || []).map((child, idx) => {
              return (
                <Fragment key={child.key + idx}>
                  {child.children ? (
                    <MenuItemWithChildren
                      item={child}
                      linkClassName={clsx(
                        "side-nav-link",
                        getActiveClass(child)
                      )}
                      activeMenuItems={activeMenuItems}
                      className={clsx(
                        "side-nav-item",
                        activeMenuItems?.includes(child.key)
                          ? "menuitem-active"
                          : ""
                      )}
                      subMenuClassName="side-nav-second-level"
                      toggleMenu={toggleMenu}
                    />
                  ) : (
                    <MenuItem
                      item={child}
                      className={clsx(
                        "side-nav-item",
                        activeMenuItems?.includes(child.key)
                          ? "menuitem-active"
                          : ""
                      )}
                      linkClassName={clsx(
                        "side-nav-link",
                        getActiveClass(child)
                      )}
                    />
                  )}
                </Fragment>
              );
            })}
          </ul>
        </div>
      </Collapse>
    </li>
  );
};

const MenuItem = ({ item, className, linkClassName }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MenuItemLink
        item={item}
        className={clsx(linkClassName, {
          "hover-scale": isHovered,
        })}
      />
    </li>
  );
};

const MenuItemLink = ({ item, className }) => {
  return (
    <Link
      to={item.url ?? ""}
      target={item.target}
      className={clsx(className, "transition-all duration-200", {
        disabled: item.isDisabled,
      })}
    >
      {item.icon && <IconifyIcon icon={item.icon} className="menu-icon" />}
      <span className="ms-2 child-label menu-text">{item.label}</span>
      {item.badge && (
        <span className={`badge float-end bg-${item.badge.variant}`}>
          {item.badge.text}
        </span>
      )}
    </Link>
  );
};

const AppMenu = ({ menuItems }) => {
  const { pathname } = useLocation();
  const [activeMenuItems, setActiveMenuItems] = useState([]);

  const toggleMenu = (menuItem, show) => {
    if (show)
      setActiveMenuItems([menuItem.key, ...findAllParent(menuItems, menuItem)]);
  };

  const getActiveClass = useCallback(
    (item) => {
      return activeMenuItems?.includes(item.key) ? "active" : "";
    },
    [activeMenuItems]
  );

  const activeMenu = useCallback(() => {
    const trimmedURL = pathname?.replaceAll("", "");
    const matchingMenuItem = getMenuItemFromURL(menuItems, trimmedURL);
    if (matchingMenuItem) {
      const activeMt = findMenuItem(menuItems, matchingMenuItem.key);
      if (activeMt) {
        setActiveMenuItems([
          activeMt.key,
          ...findAllParent(menuItems, activeMt),
        ]);
      }
      setTimeout(() => {
        const activatedItem = document.querySelector(
          `#leftside-menu-container .simplebar-content a[href="${trimmedURL}"]`
        );
        if (activatedItem) {
          const simplebarContent = document.querySelector(
            "#leftside-menu-container .simplebar-content-wrapper"
          );
          if (simplebarContent) {
            const offset = activatedItem.offsetTop - window.innerHeight * 0.4;
            scrollTo(simplebarContent, offset, 600);
          }
        }
      }, 400);

      const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      };

      const scrollTo = (element, to, duration) => {
        const start = element.scrollTop,
          change = to - start,
          increment = 20;
        let currentTime = 0;
        const animateScroll = function () {
          currentTime += increment;
          const val = easeInOutQuad(currentTime, start, change, duration);
          element.scrollTop = val;
          if (currentTime < duration) {
            setTimeout(animateScroll, increment);
          }
        };
        animateScroll();
      };
    }
  }, [pathname, menuItems]);

  useEffect(() => {
    if (menuItems && menuItems.length > 0) activeMenu();
  }, [activeMenu, menuItems]);

  return (
    <ul className="side-nav">
      {(menuItems || []).map((item, idx) => {
        return (
          <Fragment key={item.key + idx}>
            {item.isTitle ? (
              <li className="side-nav-title">{item.label}</li>
            ) : (
              <>
                {item.children ? (
                  <MenuItemWithChildren
                    item={item}
                    toggleMenu={toggleMenu}
                    className={clsx(
                      "side-nav-item",
                      activeMenuItems?.includes(item.key)
                        ? "menuitem-active"
                        : ""
                    )}
                    linkClassName={clsx("side-nav-link", getActiveClass(item))}
                    subMenuClassName="side-nav-second-level"
                    activeMenuItems={activeMenuItems}
                  />
                ) : (
                  <MenuItem
                    item={item}
                    linkClassName={clsx("side-nav-link", getActiveClass(item))}
                    className={clsx(
                      "side-nav-item",
                      activeMenuItems?.includes(item.key)
                        ? "menuitem-active"
                        : ""
                    )}
                  />
                )}
              </>
            )}
          </Fragment>
        );
      })}
    </ul>
  );
};

export default AppMenu;
