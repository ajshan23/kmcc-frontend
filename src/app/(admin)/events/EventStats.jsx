import { useEffect, useState } from "react";
import axiosInstance from "../../../globalFetch/api";
import { Card, CardBody, Col, Row, Spinner } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const EventStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/admin/stats");
        if (response.status === 200) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!stats) return null;

  const eventData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Events Created",
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Events Completed",
        data: [8, 15, 2, 4, 1, 2, 5],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const attendanceData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Row className="mb-4">
      <Col lg={8}>
        <Card className="shadow-sm h-100">
          <CardBody>
            <h5 className="card-title">Monthly Events</h5>
            <Bar
              data={eventData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Events Created vs Completed",
                  },
                },
              }}
            />
          </CardBody>
        </Card>
      </Col>
      <Col lg={4}>
        <Card className="shadow-sm h-100">
          <CardBody>
            <h5 className="card-title">Attendance Ratio</h5>
            <Pie
              data={attendanceData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default EventStats;
