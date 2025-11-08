// src/pages/dashboard/index.jsx
import { useEffect, useState } from "react";
import Card from "../../components/CardBox";
import Modal from "../../components/Modal";
import {
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
    Legend,
} from "recharts";
import { FaUsers, FaDollarSign, FaShoppingCart, FaHourglassHalf } from "react-icons/fa";
import api from "../../config/axiosConfig";
import dayjs from "dayjs";

const COLORS = ["#6366f1", "#10b981", "#f59e0b"];

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);

    // Dynamic states
    const [users, setUsers] = useState([]);
    const [cashReports, setCashReports] = useState([]);
    const [activities, setActivities] = useState([]);
    const [announcements, setAnnouncements] = useState([]);

    // Chart data states
    const [userMonthlyData, setUserMonthlyData] = useState([]);
    const [cashMonthlyData, setCashMonthlyData] = useState([]);
    const [activityMonthlyData, setActivityMonthlyData] = useState([]);
    const [announcementMonthlyData, setAnnouncementMonthlyData] = useState([]);

    // Filter states
    const [filterMonth, setFilterMonth] = useState(dayjs().format("MM"));
    const [filterYear, setFilterYear] = useState(dayjs().format("YYYY"));

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalData, setModalData] = useState([]);

    // Modal pagination states
    const [modalPage, setModalPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        setIsLoading(true);

        // Fetch all dashboard data using api like your example
        Promise.all([
            api.get("/api/users?page=1&limit=100"),
            api.get("/api/cash-reports?page=1&limit=100"),
            api.get("/api/activities?page=1&limit=100"),
            api.get("/api/announcement?page=1&limit=100"),
        ]).then(([usersRes, cashRes, actRes, annRes]) => {
            const users = usersRes?.data?.response?.data || [];
            // Fix: parseFloat for amount field
            const cashReports = (cashRes?.data?.response?.data || []).map(r => ({
                ...r,
                amount: typeof r.amount === "number" ? r.amount : parseFloat(r.amount) || 0
            }));
            const activities = actRes?.data?.response?.data || [];
            const announcements = annRes?.data?.response?.data || [];

            setUsers(users);
            setCashReports(cashReports);
            setActivities(activities);
            setAnnouncements(announcements);

            // --- Users Chart Data ---
            // Group users by month
            const userMonthMap = {};
            users.forEach(u => {
                const month = dayjs(u.created_at).format("YYYY-MM");
                userMonthMap[month] = (userMonthMap[month] || 0) + 1;
            });
            const userMonthlyArr = Object.keys(userMonthMap).sort().map(month => ({
                month,
                new_users: userMonthMap[month],
            }));
            setUserMonthlyData(userMonthlyArr);

            // --- Cash Reports Chart Data ---
            // Group cash in/out by month
            const cashMonthMap = {};
            let saldo = 0;
            cashReports.forEach(r => {
                const month = dayjs(r.date).format("YYYY-MM");
                if (!cashMonthMap[month]) cashMonthMap[month] = { in: 0, out: 0 };
                if (r.type === "in") {
                    cashMonthMap[month].in += r.amount;
                    saldo += r.amount;
                } else {
                    cashMonthMap[month].out += r.amount;
                    saldo -= r.amount;
                }
            });
            const cashMonthlyArr = Object.keys(cashMonthMap).sort().map(month => ({
                month,
                uang_masuk: cashMonthMap[month].in,
                uang_keluar: cashMonthMap[month].out,
            }));
            setCashMonthlyData(cashMonthlyArr);

            // --- Activity Chart Data ---
            // Group activities by month
            const activityMonthMap = {};
            let totalThisMonth = 0;
            let belumBerjalan = 0;
            const nowMonth = dayjs().format("YYYY-MM");
            activities.forEach(a => {
                const month = dayjs(a.activity_date).format("YYYY-MM");
                activityMonthMap[month] = (activityMonthMap[month] || 0) + 1;
                if (month === nowMonth) totalThisMonth++;
                if (dayjs(a.activity_date).isAfter(dayjs())) belumBerjalan++;
            });
            const activityMonthlyArr = Object.keys(activityMonthMap).sort().map(month => ({
                month,
                total_activity: activityMonthMap[month],
            }));
            setActivityMonthlyData(activityMonthlyArr);

            // --- Announcement Chart Data ---
            // Group announcements by month and status
            const annMonthMap = {};
            announcements.forEach(a => {
                const month = dayjs(a.start_date).format("YYYY-MM");
                if (!annMonthMap[month]) {
                    annMonthMap[month] = {
                        berlangsung: 0,
                        active: 0,
                        nonactive: 0,
                        kedaluarsa: 0,
                    };
                }
                if (a.is_current) annMonthMap[month].berlangsung++;
                if (a.is_active) annMonthMap[month].active++;
                if (!a.is_active) annMonthMap[month].nonactive++;
                if (!a.is_current && a.is_active) annMonthMap[month].kedaluarsa++;
            });
            const announcementMonthlyArr = Object.keys(annMonthMap).sort().map(month => ({
                month,
                berlangsung: annMonthMap[month].berlangsung,
                active: annMonthMap[month].active,
                nonactive: annMonthMap[month].nonactive,
                kedaluarsa: annMonthMap[month].kedaluarsa,
            }));
            setAnnouncementMonthlyData(announcementMonthlyArr);

        }).finally(() => setIsLoading(false));
    }, []);

    // Helper for filtering by month/year
    function isMatchMonthYear(dateStr) {
        if (filterMonth === "all" && filterYear === "all") return true;
        const d = dayjs(dateStr);
        const m = d.format("MM");
        const y = d.format("YYYY");
        if (filterMonth === "all" && filterYear !== "all") return y === filterYear;
        if (filterMonth !== "all" && filterYear === "all") return m === filterMonth;
        return m === filterMonth && y === filterYear;
    }

    // Filtered data
    const filteredUsers = users.filter(u => isMatchMonthYear(u.created_at));
    const filteredCashReports = cashReports.filter(r => isMatchMonthYear(r.date));
    const filteredActivities = activities.filter(a => isMatchMonthYear(a.activity_date));
    const filteredAnnouncements = announcements.filter(a => isMatchMonthYear(a.start_date));

    // Dynamic stats (filtered)
    const totalUsers = filteredUsers.length;
    // Revenue: sum of all "in" cashReports only
    const totalRevenue = filteredCashReports
        .filter(r => r.type === "in")
        .reduce((sum, r) => sum + (r.amount || 0), 0);
    const totalOrders = filteredActivities.length;
    const totalPending = filteredAnnouncements.filter(a => a.is_active && !a.is_current).length;

    // Chart data (filtered)
    const userMonthlyDataFiltered = userMonthlyData.filter(d => {
        if (filterYear !== "all" && d.month.slice(0, 4) !== filterYear) return false;
        if (filterMonth !== "all" && d.month.slice(5, 7) !== filterMonth) return false;
        return true;
    });
    const cashMonthlyDataFiltered = cashMonthlyData.filter(d => {
        if (filterYear !== "all" && d.month.slice(0, 4) !== filterYear) return false;
        if (filterMonth !== "all" && d.month.slice(5, 7) !== filterMonth) return false;
        return true;
    });
    const activityMonthlyDataFiltered = activityMonthlyData.filter(d => {
        if (filterYear !== "all" && d.month.slice(0, 4) !== filterYear) return false;
        if (filterMonth !== "all" && d.month.slice(5, 7) !== filterMonth) return false;
        return true;
    });
    const announcementMonthlyDataFiltered = announcementMonthlyData.filter(d => {
        if (filterYear !== "all" && d.month.slice(0, 4) !== filterYear) return false;
        if (filterMonth !== "all" && d.month.slice(5, 7) !== filterMonth) return false;
        return true;
    });

    // Month/year options
    const monthOptions = [
        { value: "all", label: "All Month" },
        ...Array.from({ length: 12 }, (_, i) => ({
            value: String(i + 1).padStart(2, "0"),
            label: dayjs(`2023-${String(i + 1).padStart(2, "0")}-01`).format("MMMM"),
        })),
    ];
    const yearOptions = [
        { value: "all", label: "All Year" },
        ...Array.from(new Set([
            ...users.map(u => dayjs(u.created_at).format("YYYY")),
            ...cashReports.map(r => dayjs(r.date).format("YYYY")),
            ...activities.map(a => dayjs(a.activity_date).format("YYYY")),
            ...announcements.map(a => dayjs(a.start_date).format("YYYY")),
        ])).sort().map(y => ({ value: y, label: y })),
    ];

    // Helper to open modal with chart data for a specific bar
    const handleBarClick = (chartType, payload, barType = null) => {
        let title = "";
        let columns = [];
        let data = [];

        // Get year and month from payload
        const [year, month] = payload.month.split("-");

        if (chartType === "cash") {
            if (barType === "in") {
                title = `Detail Cash In Month ${payload.month}`;
                columns = ["date", "description", "amount", "type", "category"];
                data = cashReports.filter(r => {
                    const d = dayjs(r.date);
                    return r.type === "in" && d.format("YYYY") === year && d.format("MM") === month;
                });
            } else if (barType === "out") {
                title = `Detail Cash Out Month ${payload.month}`;
                columns = ["date", "description", "amount", "type", "category"];
                data = cashReports.filter(r => {
                    const d = dayjs(r.date);
                    return r.type === "out" && d.format("YYYY") === year && d.format("MM") === month;
                });
            } else {
                // fallback: show all cash in/out
                title = `Detail Cash In/Out Month ${payload.month}`;
                columns = ["date", "description", "amount", "type", "category"];
                data = cashReports.filter(r => {
                    const d = dayjs(r.date);
                    return d.format("YYYY") === year && d.format("MM") === month;
                });
            }
        }
        if (chartType === "users") {
            title = `Detail Users Month ${payload.month}`;
            columns = ["name", "email"];
            data = users.filter(u => {
                const d = dayjs(u.created_at);
                return d.format("YYYY") === year && d.format("MM") === month;
            });
        }
        if (chartType === "activity") {
            title = `Detail Activity Month ${payload.month}`;
            columns = ["title", "activity_date", "description"];
            data = activities.filter(a => {
                const d = dayjs(a.activity_date);
                return d.format("YYYY") === year && d.format("MM") === month;
            });
        }
        if (chartType === "announcement") {
            title = `Detail Announcement Month ${payload.month}`;
            columns = ["title", "category", "content", "start_date", "end_date"];
            data = announcements.filter(a => {
                const d = dayjs(a.start_date);
                return d.format("YYYY") === year && d.format("MM") === month;
            });
        }

        setModalTitle(title);
        setModalData({ data, columns });
        setModalPage(1); // Reset to first page when opening modal
        setModalOpen(true);
    };

    // Helper for formatting date to dd-mmm-yyyy (e.g. 14-Nov-2025)
    function formatDate(dateStr) {
        const d = dayjs(dateStr);
        return d.isValid() ? d.format("DD-MMM-YYYY") : "";
    }

    const columnLabels = {
        date: "Date",
        description: "Description",
        amount: "Amount",
        type: "Type",
        category: "Category",
        user_id: "User ID",
        created_at: "Created At",
        updated_at: "Updated At",
        deleted_at: "Deleted At",
        reason: "Reason",
        deleted_by: "Deleted By",
        name: "Name",
        email: "Email",
        title: "Title",
        activity_date: "Activity Date",
        content: "Content",
        start_date: "Start Date",
        end_date: "End Date"
        // Add more if needed
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">📊 Dashboard</h1>

            {/* Filter Controls */}
            <div className="flex gap-4 mb-6">
                <select
                    value={filterMonth}
                    onChange={e => setFilterMonth(e.target.value)}
                    className="px-3 py-2 rounded border"
                >
                    {monthOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <select
                    value={filterYear}
                    onChange={e => setFilterYear(e.target.value)}
                    className="px-3 py-2 rounded border"
                >
                    {yearOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Statistic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-blue-100">
                    <div className="flex items-center gap-3">
                        <FaUsers className="text-blue-600 text-xl" />
                        <div>
                            <p className="text-sm text-gray-600">Users</p>
                            <p className="text-xl font-bold text-blue-800">{totalUsers}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-green-100">
                    <div className="flex items-center gap-3">
                        <FaDollarSign className="text-green-600 text-xl" />
                        <div>
                            <p className="text-sm text-gray-600">Revenue</p>
                            <p className="text-xl font-bold text-green-800">
                                {totalRevenue.toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                })}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-yellow-100">
                    <div className="flex items-center gap-3">
                        <FaShoppingCart className="text-yellow-600 text-xl" />
                        <div>
                            <p className="text-sm text-gray-600">Activities</p>
                            <p className="text-xl font-bold text-yellow-800">{totalOrders}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-red-100">
                    <div className="flex items-center gap-3">
                        <FaHourglassHalf className="text-red-600 text-xl" />
                        <div>
                            <p className="text-sm text-gray-600">Pending Announcements</p>
                            <p className="text-xl font-bold text-red-800">{totalPending}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* User Monthly Bar Chart */}
            <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Monthly Users (Bar)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={userMonthlyDataFiltered}
                            dataKey="new_users"
                            nameKey="month"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#6366f1"
                            label
                        >
                            {userMonthlyDataFiltered.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    cursor="pointer"
                                    onClick={() => handleBarClick("users", entry)}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>

            {/* Cash Reports Charts */}
            <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Cash In/Out Per Month & Total Balance</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={cashMonthlyDataFiltered.map(item => ({
                            ...item,
                            uang_masuk: typeof item.uang_masuk === "number"
                                ? item.uang_masuk
                                : parseFloat(item.uang_masuk) || 0,
                            uang_keluar: typeof item.uang_keluar === "number"
                                ? item.uang_keluar
                                : parseFloat(item.uang_keluar) || 0,
                        }))}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis
                            tickFormatter={value =>
                                value.toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                })
                            }
                        />
                        <Tooltip
                            formatter={(value) =>
                                typeof value === "number"
                                    ? value.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    })
                                    : value
                            }
                            labelFormatter={label => `Month: ${label}`}
                        />
                        <Bar dataKey="uang_masuk" fill="#10b981" name="Cash In">
                            {cashMonthlyDataFiltered.map((entry, index) => (
                                <Cell
                                    key={`cell-in-${index}`}
                                    cursor="pointer"
                                    onClick={() => handleBarClick("cash", entry, "in")}
                                />
                            ))}
                        </Bar>
                        <Bar dataKey="uang_keluar" fill="#f59e0b" name="Cash Out">
                            {cashMonthlyDataFiltered.map((entry, index) => (
                                <Cell
                                    key={`cell-out-${index}`}
                                    cursor="pointer"
                                    onClick={() => handleBarClick("cash", entry, "out")}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                    <div className="text-lg font-bold text-green-700">
                        Total Cash In: {filteredCashReports
                            .filter(r => r.type === "in")
                            .reduce((sum, r) => sum + (typeof r.amount === "number" ? r.amount : parseFloat(r.amount) || 0), 0)
                            .toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            })}
                    </div>
                    <div className="text-lg font-bold text-red-700">
                        Total Cash Out: {filteredCashReports
                            .filter(r => r.type === "out")
                            .reduce((sum, r) => sum + (typeof r.amount === "number" ? r.amount : parseFloat(r.amount) || 0), 0)
                            .toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            })}
                    </div>
                    <div className="text-lg font-bold text-blue-700">
                        Total Balance: {filteredCashReports.reduce((sum, r) => {
                            const amt = typeof r.amount === "number" ? r.amount : parseFloat(r.amount) || 0;
                            return r.type === "in" ? sum + amt : sum - amt;
                        }, 0).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}
                    </div>
                </div>
            </Card>

            {/* Activity Charts */}
            <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Activities Per Month & Not Started</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activityMonthlyDataFiltered}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total_activity" fill="#6366f1" name="Total Activities">
                            {activityMonthlyDataFiltered.map((entry, index) => (
                                <Cell
                                    key={`cell-activity-${index}`}
                                    cursor="pointer"
                                    onClick={() => handleBarClick("activity", entry)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-lg font-bold text-yellow-700">
                    Total Activities This Month: {activityMonthlyDataFiltered.find(a => a.month === dayjs().format("YYYY-MM"))?.total_activity || 0}
                </div>
                <div className="text-lg font-bold text-red-700">
                    Not Started Activities: {filteredActivities.filter(a => dayjs(a.activity_date).isAfter(dayjs())).length}
                </div>
            </Card>

            {/* Announcement Charts */}
            <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Announcements Per Month</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={announcementMonthlyDataFiltered}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="berlangsung" fill="#6366f1" name="Ongoing">
                            {announcementMonthlyDataFiltered.map((entry, index) => (
                                <Cell
                                    key={`cell-ann-berlangsung-${index}`}
                                    cursor="pointer"
                                    onClick={() => handleBarClick("announcement", entry)}
                                />
                            ))}
                        </Bar>
                        <Bar dataKey="active" fill="#10b981" name="Active">
                            {announcementMonthlyDataFiltered.map((entry, index) => (
                                <Cell
                                    key={`cell-ann-active-${index}`}
                                    cursor="pointer"
                                    onClick={() => handleBarClick("announcement", entry)}
                                />
                            ))}
                        </Bar>
                        <Bar dataKey="nonactive" fill="#f59e0b" name="Non Active">
                            {announcementMonthlyDataFiltered.map((entry, index) => (
                                <Cell
                                    key={`cell-ann-nonactive-${index}`}
                                    cursor="pointer"
                                    onClick={() => handleBarClick("announcement", entry)}
                                />
                            ))}
                        </Bar>
                        <Bar dataKey="kedaluarsa" fill="#ef4444" name="Expired">
                            {announcementMonthlyDataFiltered.map((entry, index) => (
                                <Cell
                                    key={`cell-ann-kedaluarsa-${index}`}
                                    cursor="pointer"
                                    onClick={() => handleBarClick("announcement", entry)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Modal for chart data */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalTitle}
                modalFooter={false}
            >
                <div className="overflow-x-auto w-full">
                    <table className="w-full border border-gray-200 rounded shadow bg-gray-800 text-white text-sm font-semibold text-center">
                        <thead>
                            <tr>
                                {modalData.columns && modalData.columns.map(col => (
                                    <th key={col} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold border-b">
                                        {columnLabels[col] || col.replace(/_/g, " ").toUpperCase()}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {modalData.data &&
                                modalData.data
                                    .slice((modalPage - 1) * pageSize, modalPage * pageSize)
                                    .map((row, idx) => (
                                        <tr key={idx} className="border-b">
                                            {modalData.columns.map(col => (
                                                <td key={col} className="px-4 py-2 text-white">
                                                    {col === "amount" && typeof row[col] === "number"
                                                        ? row[col].toLocaleString("id-ID", {
                                                            style: "currency",
                                                            currency: "IDR",
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0
                                                        })
                                                        : (col.includes("date") || col === "created_at" || col === "updated_at" || col === "deleted_at" || col === "activity_date")
                                                            ? formatDate(row[col])
                                                            : row[col]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                    {/* Pagination controls */}
                    {modalData.data && modalData.data.length > pageSize && (
                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                                className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
                                onClick={() => setModalPage(modalPage - 1)}
                                disabled={modalPage === 1}
                            >
                                Prev
                            </button>
                            <span className="px-2 text-white">
                                Page {modalPage} of {Math.ceil(modalData.data.length / pageSize)}
                            </span>
                            <button
                                className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
                                onClick={() => setModalPage(modalPage + 1)}
                                disabled={modalPage === Math.ceil(modalData.data.length / pageSize)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
