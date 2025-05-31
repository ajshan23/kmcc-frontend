import { useEffect, useState } from "react";
import axiosInstance from "../../../globalFetch/api";
import {
  Table,
  Badge,
  Button,
  Toast,
  ToastHeader,
  ToastBody,
  Pagination,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";
import SendNotificationForm from "./SendNotificationForm";

const AdminNotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showSendForm, setShowSendForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchNotifications = async (page = 1) => {
    try {
      const offset = (page - 1) * limit;
      const response = await axiosInstance.get(
        `/notify/admin/all?limit=${limit}&offset=${offset}`
      );
      setNotifications(response.data.data.notifications);
      setTotalPages(Math.ceil(response.data.data.totalCount / limit));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setToastMessage("Failed to load notifications");
      setShowToast(true);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const refreshNotifications = () => {
    fetchNotifications(currentPage);
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>All Notifications</h4>
        <Button variant="primary" onClick={() => setShowSendForm(true)}>
          <IconifyIcon icon="mdi:bell-plus" className="me-1" />
          Send Notification
        </Button>
      </div>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <ToastHeader>
          <img src={smLogo} alt="brand-logo" height="16" className="me-1" />
          <strong className="me-auto">Notification</strong>
        </ToastHeader>
        <ToastBody>{toastMessage}</ToastBody>
      </Toast>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Message</th>
            <th>User</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {notifications.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted">
                No notifications found
              </td>
            </tr>
          ) : (
            notifications.map((notification) => (
              <tr key={notification.id}>
                <td>{notification.id}</td>
                <td>{notification.title}</td>
                <td>{notification.body}</td>
                <td>
                  {notification.user ? (
                    <div>
                      <div>{notification.user.name}</div>
                      <small className="text-muted">
                        {notification.user.email}
                      </small>
                    </div>
                  ) : (
                    <Badge bg="secondary">Global</Badge>
                  )}
                </td>
                <td>{new Date(notification.createdAt).toLocaleString()}</td>
                <td>
                  <Badge bg={notification.isRead ? "success" : "warning"}>
                    {notification.isRead ? "Read" : "Unread"}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}

            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      <SendNotificationForm
        show={showSendForm}
        onClose={() => {
          setShowSendForm(false);
          refreshNotifications();
        }}
      />
    </div>
  );
};

export default AdminNotificationList;
