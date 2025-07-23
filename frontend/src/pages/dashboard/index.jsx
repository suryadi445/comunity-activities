// src/pages/dashboard/index.jsx
import Card from "../../components/CardBox";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { FaUsers, FaDollarSign, FaShoppingCart, FaHourglassHalf } from "react-icons/fa";
import { useEffect, useState } from "react";

const data = [
    { name: "Jan", users: 400 },
    { name: "Feb", users: 300 },
    { name: "Mar", users: 500 },
    { name: "Apr", users: 700 },
    { name: "May", users: 600 },
];

const pieData = [
    { name: "Mobile", value: 600 },
    { name: "Desktop", value: 400 },
    { name: "Tablet", value: 200 },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b"];

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">📊 Dashboard</h1>

            {/* Statistic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-blue-100">
                    <div className="flex items-center gap-3">
                        <FaUsers className="text-blue-600 text-xl" />
                        <div>
                            <p className="text-sm text-gray-600">Users</p>
                            <p className="text-xl font-bold text-blue-800">1,204</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-green-100">
                    <div className="flex items-center gap-3">
                        <FaDollarSign className="text-green-600 text-xl" />
                        <div>
                            <p className="text-sm text-gray-600">Revenue</p>
                            <p className="text-xl font-bold text-green-800">$8,450</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-yellow-100">
                    <div className="flex items-center gap-3">
                        <FaShoppingCart className="text-yellow-600 text-xl" />
                        <div>
                            <p className="text-sm text-gray-600">Orders</p>
                            <p className="text-xl font-bold text-yellow-800">312</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-red-100">
                    <div className="flex items-center gap-3">
                        <FaHourglassHalf className="text-red-600 text-xl" />
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-xl font-bold text-red-800">45</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Line Chart */}
            <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">User Growth (Line)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* Bar and Pie Charts */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Monthly Users (Bar)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="users" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Device Usage (Pie)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                label
                                outerRadius={100}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
