import { Card, CardBody, CardTitle } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../globalFetch/api";

const Card1 = () => {
  const [imageData, setImageData] = useState("");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axiosInstance.get("/admin/get-banner");
        if (response.status === 200) {
          setImageData(response.data?.image);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBanner();
  }, []);

  return (
    <Card className="d-block shadow-sm" style={{ maxWidth: "400px" }}>
      {imageData && (
        <div className="text-center">
          <img src={imageData} alt="Banner" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      )}
      <CardBody>
        <CardTitle as="h4">Current Banner</CardTitle>
        <Link to="/banner/update" className="btn btn-primary">
          Update
        </Link>
      </CardBody>
    </Card>
  );
};

const Banner = () => {
  return (
    <div className="d-flex justify-content-left p-4">
      <PageTitle title="Banner" />
      <Card1 />
    </div>
  );
};

export default Banner;
