import { useState } from "react";
import {
  Button,
  Form,
  Modal,
  Toast,
  ToastHeader,
  ToastBody,
} from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";

const SendNotificationForm = ({ show, onClose }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await axiosInstance.post("/notify/global", {
        title,
        body,
      });

      setToastMessage("Notification sent successfully!");
      setShowToast(true);
      onClose();
      setTitle("");
      setBody("");
    } catch (error) {
      console.error("Error sending notification:", error);
      setToastMessage("Failed to send notification");
      setShowToast(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Send Global Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSending}>
                {isSending ? "Sending..." : "Send Notification"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

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
    </>
  );
};

export default SendNotificationForm;
