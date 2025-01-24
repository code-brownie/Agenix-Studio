"use client";
import React, { useEffect, useState } from "react";
import { Bar, Line, Pie, Doughnut, PolarArea, Bubble } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    ArcElement,
    RadialLinearScale
} from "chart.js";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    ArcElement,
    RadialLinearScale
);

// Define TypeScript interfaces for API response
interface ApiData {
    accuracy: number;
    auc: number;
    conversion_rate: number;
    f1_score: number;
    mse: number;
    sample_data: SampleData[];
}

interface SampleData {
    Bounce_Rate: number;
    Cart_Abandonment_Rate: number;
    Loyalty_Score: number;
    Conversion: number;
    Traffic_Source: string;
    Interactions: number;
}

const APIComponent: React.FC = () => {
    const [apiData, setApiData] = useState<ApiData | null>(null);
    const [sampleData, setSampleData] = useState<SampleData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/simulate");
                const data: ApiData = await response.json();
                setApiData(data);
                setSampleData(data.sample_data);
            } catch (error) {
                console.error("Error fetching API data:", error);
            }
        };

        fetchData();
    }, []);

    if (!apiData || sampleData.length === 0) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // Prepare data for charts
    const bounceRates = sampleData.map((item) => item.Bounce_Rate);
    const abandonmentRates = sampleData.map((item) => item.Cart_Abandonment_Rate);
    const loyaltyScores = sampleData.map((item) => item.Loyalty_Score);
    const conversions = sampleData.map((item) => item.Conversion);
    const trafficSources = sampleData.map((item) => item.Traffic_Source);

    const trafficSourceCounts = trafficSources.reduce<Record<string, number>>((acc, source) => {
        acc[source] = (acc[source] || 0) + 1;
        return acc;
    }, {});

    // Bar Chart
    const barChartData = {
        labels: sampleData.slice(0, 10).map((_, index) => `User ${index + 1}`),
        datasets: [
            {
                label: "Bounce Rate",
                data: bounceRates.slice(0, 10),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
                label: "Cart Abandonment Rate",
                data: abandonmentRates.slice(0, 10),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
        ],
    };

    // Line Chart
    const lineChartData = {
        labels: sampleData.map((_, index) => `User ${index + 1}`),
        datasets: [
            {
                label: "Loyalty Scores",
                data: loyaltyScores,
                borderColor: "rgba(54, 162, 235, 1)",
                fill: false,
            },
        ],
    };

    // Pie Chart
    const pieChartData = {
        labels: ["Converted", "Not Converted"],
        datasets: [
            {
                data: [
                    conversions.filter((c) => c === 1).length,
                    conversions.filter((c) => c === 0).length,
                ],
                backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
            },
        ],
    };

    // Doughnut Chart
    const doughnutChartData = {
        labels: Object.keys(trafficSourceCounts),
        datasets: [
            {
                data: Object.values(trafficSourceCounts),
                backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(201, 203, 207, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(199, 199, 199, 0.6)",
                    "rgba(83, 102, 255, 0.6)",
                    "rgba(105, 255, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(201, 203, 207, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(199, 199, 199, 0.6)",
                    "rgba(83, 102, 255, 0.6)",
                    "rgba(105, 255, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(201, 203, 207, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(199, 199, 199, 0.6)",
                    "rgba(83, 102, 255, 0.6)",
                    "rgba(105, 255, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(201, 203, 207, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(199, 199, 199, 0.6)",
                    "rgba(83, 102, 255, 0.6)",
                    "rgba(105, 255, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(201, 203, 207, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(199, 199, 199, 0.6)",
                    "rgba(83, 102, 255, 0.6)",
                    "rgba(105, 255, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(201, 203, 207, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(199, 199, 199, 0.6)",
                    "rgba(83, 102, 255, 0.6)",
                    "rgba(105, 255, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(201, 203, 207, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(199, 199, 199, 0.6)",
                    "rgba(83, 102, 255, 0.6)",
                    "rgba(105, 255, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(201, 203, 207, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(199, 199, 199, 0.6)",
                    "rgba(83, 102, 255, 0.6)",
                    "rgba(105, 255, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(201, 203, 207, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(199, 199, 199, 0.6)",
                    "rgba(83, 102, 255, 0.6)",
                    "rgba(105, 255, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(201, 203, 207, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(199, 199, 199, 0.6)",
                    "rgba(83, 102, 255, 0.6)",
                    "rgba(105, 255, 86, 0.6)",
                ],
            },
        ],
    };

    // Polar Area Chart
    const polarChartData = {
        labels: sampleData.slice(0, 100).map((_, index) => `User ${index + 1}`),
        datasets: [
            {
                label: "Bounce Rates",
                data: bounceRates.slice(0, 100),
                backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(153, 102, 255, 0.6)"],
            },
        ],
    };

    // Bubble Chart
    const bubbleChartData = {
        datasets: [
            {
                label: "Interactions and Loyalty",
                data: sampleData.slice(0, 50).map((item) => ({
                    x: item.Interactions,
                    y: item.Loyalty_Score,
                    r: Math.sqrt(item.Interactions) * 2, // Bubble size proportional to interactions
                })),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
        ],
    };

    return (
        <div className="p-8 font-sans bg-gray-100 min-h-screen">
            <h1 className="text-black text-3xl font-bold text-center mb-8">Client Data and Predictions Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div className="bg-white shadow-md p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-700">Key Metrics</h2>
                    <p className="mt-2 text-gray-600"><strong>Accuracy:</strong> {apiData.accuracy.toFixed(4)}</p>
                    <p className="text-gray-600"><strong>AUC:</strong> {apiData.auc.toFixed(4)}</p>
                    <p className="text-gray-600"><strong>Conversion Rate:</strong> {apiData.conversion_rate.toFixed(4)}</p>
                    <p className="text-gray-600"><strong>F1 Score:</strong> {apiData.f1_score.toFixed(4)}</p>
                    <p className="text-gray-600"><strong>Mean Squared Error:</strong> {apiData.mse.toFixed(4)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                <div className="bg-white shadow-md p-4 rounded-lg">
                    <h3 className="text-black text-lg font-semibold mb-4">Bar Chart</h3>
                    <Bar data={barChartData} options={{ responsive: true }} />
                </div>

                <div className="bg-white shadow-md p-4 rounded-lg">
                    <h3 className="text-black text-lg font-semibold mb-4">Line Chart</h3>
                    <Line data={lineChartData} options={{ responsive: true }} />
                </div>

                <div className="bg-white shadow-md p-4 rounded-lg">
                    <h3 className="text-black text-lg font-semibold mb-4">Pie Chart</h3>
                    <Pie data={pieChartData} options={{ responsive: true }} />
                </div>

                <div className="bg-white shadow-md p-4 rounded-lg">
                    <h3 className="text-black text-lg font-semibold mb-4">Doughnut Chart</h3>
                    <Doughnut data={doughnutChartData} options={{ responsive: true }} />
                </div>

                <div className="bg-white shadow-md p-4 rounded-lg">
                    <h3 className="text-black text-lg font-semibold mb-4">Polar Area Chart</h3>
                    <PolarArea data={polarChartData} options={{ responsive: true }} />
                </div>

                <div className="bg-white shadow-md p-4 rounded-lg">
                    <h3 className="text-black text-lg font-semibold mb-4">Bubble Chart</h3>
                    <Bubble data={bubbleChartData} options={{ responsive: true }} />
                </div>
            </div>
        </div>
    );
};

export default APIComponent;
