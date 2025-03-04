import { useEffect, useState } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Card, CardBody, Col, ProgressBar, Row } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import axiosInstance from "../../../../globalFetch/api";

const StatCard = ({ stat }) => {
  const { title, icon, count, variant, chartData } = stat;

  // Wave-like chart options using real backend data
  const chartOptions = {
    chart: {
      type: "area",
      height: 60,
      sparkline: { enabled: true },
    },
    stroke: { width: 2, curve: "smooth" },
    fill: { opacity: 0.2 },
    colors: [variant === "primary" ? "#0d6efd" : "#198754"],
    series: [
      {
        name: title,
        data: chartData, // Using backend data for dynamic visualization
      },
    ],
    xaxis: { labels: { show: false } },
    yaxis: { labels: { show: false } },
    grid: { show: false },
    tooltip: { enabled: false },
  };

  return (
    <Card className="overflow-hidden border-top-0">
      <ProgressBar
        variant={variant}
        now={100}
        className="progress-sm rounded-0 bg-light"
      />
      <CardBody>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p className="text-muted fw-semibold fs-16 mb-1">{title}</p>
          </div>
          <div className="avatar-sm mb-4">
            <div
              className={`avatar-title bg-${variant}-subtle text-${variant} fs-24 rounded`}
            >
              <IconifyIcon icon={icon} />
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap flex-lg-nowrap justify-content-between align-items-end">
          <h3 className="mb-0 d-flex">
            <IconifyIcon icon={icon} />
            {count}
          </h3>
        </div>
        {/* Wave Chart - Now Using Backend Data */}
        <ReactApexChart
          options={chartOptions}
          series={chartOptions.series}
          type="area"
          height={60}
        />
      </CardBody>
    </Card>
  );
};

const Stats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMemberships: 0,
    userTrend: [], // Data for wave chart
    membershipTrend: [], // Data for wave chart
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/admin/stats");
        if (response.status === 200) {
          setStats(response.data.data); // Store fetched data
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      title: "Total Users",
      icon: "bi:people",
      count: stats.totalUsers,
      variant: "primary",
      chartData: stats.userTrend.length
        ? stats.userTrend
        : [10, 20, 15, 30, 25, 35, 40], // Default if no data
    },
    {
      title: "Total Memberships",
      icon: "bi:card-checklist",
      count: stats.totalMemberships,
      variant: "success",
      chartData: stats.membershipTrend.length
        ? stats.membershipTrend
        : [5, 15, 10, 20, 18, 25, 30], // Default if no data
    },
  ];

  return (
    <Row>
      {statsData.map((stat, idx) => (
        <Col xl={4} key={idx}>
          <StatCard stat={stat} />
        </Col>
      ))}
    </Row>
  );
};

export default Stats;
