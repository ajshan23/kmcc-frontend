import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../globalFetch/api";
import MemberForm from "./MemberForm";
import PageTitle from "../../../components/PageTitle";
import {
  Card,
  CardBody,
  Toast,
  ToastHeader,
  ToastBody,
  Spinner,
} from "react-bootstrap";
import smLogo from "@/assets/images/logo-sm.png";

const MemberEditForm = () => {
  const { committeeId, memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/constitution-committees/members/${memberId}`
        );
        if (response.status === 200) {
          setMember(response.data.data);
        } else {
          throw new Error("Failed to fetch member");
        }
      } catch (error) {
        console.error("Error fetching member:", error);
        setToastMessage(
          error.response?.data?.message || "Failed to load member data"
        );
        setShowToast(true);
        navigate(`/constitution-committees/${committeeId}`);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [memberId, committeeId, navigate]);

  const handleSuccess = (updatedMember) => {
    setToastMessage("Member updated successfully");
    setShowToast(true);
    setTimeout(() => {
      navigate(`/constitution-committees/${updatedMember.committeeId}`);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="d-flex justify-content-center p-5">Member not found</div>
    );
  }

  return (
    <>
      <PageTitle title="Edit Committee Member" />

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={5000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <ToastHeader>
          <img src={smLogo} alt="brand-logo" height="16" className="me-1" />
          <strong className="me-auto">KMCC</strong>
        </ToastHeader>
        <ToastBody>{toastMessage}</ToastBody>
      </Toast>

      <Card>
        <CardBody>
          <MemberForm
            committeeId={committeeId}
            initialData={member}
            onSuccess={handleSuccess}
            onCancel={() => navigate(`/constitution-committees/${committeeId}`)}
          />
        </CardBody>
      </Card>
    </>
  );
};

export default MemberEditForm;
