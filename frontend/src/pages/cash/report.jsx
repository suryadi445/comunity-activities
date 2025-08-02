import { useCallback, useEffect, useState } from "react";
import Row from "../../components/Row";
import TableComponent from "../../components/Table";
import HeaderActions from "../../components/HeaderActions";
import Modal from "../../components/Modal";
import InputLabel from "../../components/InputLabel";
import SelectLabel from "../../components/SelectLabel";
import TextareaLabel from "../../components/TextareaLabel";
import DatepickerLabel from "../../components/DatepickerLabel";
import { toastError, toastSuccess } from "../../components/Toast";
import api from "../../config/axiosConfig";
import Loading from "../../components/Loading";
import formatRupiah from "../../utils/formatRupiah";

const Cash = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isModalVoidOpen, setIsModalVoidOpen] = useState(false);
    const [id, setId] = useState('');
    const [type, setType] = useState('');
    const [date, setDate] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [dateFilter, setDateFilter] = useState(null);
    const [typeFilter, setTypeFilter] = useState('');

    const columns = [
        { key: "type", label: "type" },
        { key: "date", label: "date" },
        { key: "amount", label: "amount" },
        { key: "category", label: "category" },
        { key: "description", label: "description" },
    ];

    const filter = [
        {
            type: "select",
            label: "Transaction Type",
            prop: "type",
            value: typeFilter,
            onChange: (e) => {
                setTypeFilter(e.target.value);
                setRefreshTrigger(prev => prev + 1);
            },
            options: [
                { label: "All", value: "" },
                { label: "In", value: "in" },
                { label: "Out", value: "out" }
            ]
        },
        {
            type: "date",
            label: "Transaction Date",
            prop: "date",
            value: dateFilter,
            onChange: (date) => {
                if (date instanceof Date) {
                    const formatted = formatDate(date);
                    setDateFilter(formatted);
                    setRefreshTrigger(prev => prev + 1);
                }
            }
        }
    ];

    const formatDate = (e) => {
        const y = e.getFullYear();
        const m = String(e.getMonth() + 1).padStart(2, "0");
        const d = String(e.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const fetchData = useCallback(async (page, limit) => {
        setLoading(true);
        let date = dateFilter || "";

        try {
            const response = await api.get(`/api/cash-reports?page=${page}&limit=${limit}&type=${typeFilter}&date=${date}`);
            const allData = response.data.response.data.map(item => ({
                ...item,
                amount: formatRupiah(item.amount)
            }));

            return {
                data: allData,
                last_page: response.data.response.last_page
            };
        } catch (error) {
            return {
                data: [],
                last_page: 1
            };
        } finally {
            setLoading(false);
        }
    }, [dateFilter, typeFilter, refreshTrigger]);

    const handleModalAdd = () => {
        setIsEditMode(false);
        setIsModalOpen(true);
        setType('');
        setDate('');
        setAmount('');
        setCategory('');
        setDescription('');
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await api.post("/api/cash-report", {
                type,
                date,
                amount: Number(amount.replace(/[^0-9]/g, '')),
                category,
                description
            });

            if (response.status === 201) {
                setIsModalOpen(false);
                toastSuccess("Cash Report added successfully");
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            const res = error?.response;

            if (res?.status === 422 && Array.isArray(res?.data?.response)) {
                toastError(res.data.response.join("\n"));
            } else {
                toastError(error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleModalEdit = (data) => {
        setIsEditMode(true);
        setIsModalOpen(true);
        setId(data.id);
        setType(data.type);
        setDate(data.date);
        setAmount(data.amount);
        setCategory(data.category);
        setDescription(data.description);
    };

    const handleSubmitEdit = async () => {
        try {
            const response = await api.put("/api/cash-report", {
                id,
                type,
                date,
                amount: Number(amount.replace(/[^0-9]/g, '')),
                category,
                description
            });

            if (response.status === 200) {
                setIsModalOpen(false);
                toastSuccess("Cash Report updated successfully");
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            toastError(error);
        }
    };

    const handleDelete = (data) => {
        setIsModalVoidOpen(true);
        setId(data.id);
        setType(data.type);
        setDate(data.date);
        setAmount(data.amount);
        setCategory(data.category);
        setDescription(data.description);
        setReason('');
    };

    const submitVoid = async () => {
        try {
            const response = await api.delete("/api/cash-report", {
                data: {
                    id,
                    reason
                }
            });
            if (response.status === 200) {
                setIsModalVoidOpen(false);
                toastSuccess("Cash Report voided successfully");
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            toastError(error);
        }
    };

    return (
        <div>
            <main>
                <Row>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Cash Report</h1>
                    </div>
                </Row>

                <HeaderActions
                    tooltip="Add Cash Report"
                    onButtonClick={handleModalAdd}
                    buttonAdd={true}
                    inputSearch={false}
                    filter={filter}
                />

                <Row>
                    <TableComponent
                        columns={columns}
                        fetchData={fetchData}
                        showEdit={true}
                        showDelete={true}
                        onEdit={handleModalEdit}
                        onDelete={handleDelete}
                        tooltip="Cash Report"
                    />
                </Row>
            </main>

            <Modal size="max-w-xl" isOpen={isModalOpen} title={isEditMode ? "Edit Cash Report" : "Add Cash Report"} onClose={() => setIsModalOpen(false)} onAccept={isEditMode ? handleSubmitEdit : handleSubmit}>
                <form>
                    <Row cols={2}>
                        <SelectLabel label="Type" prop="type" options={[{ label: "In", value: "in" }, { label: "Out", value: "out" }]} onChange={(e) => setType(e.target.value)} value={type} />

                        <DatepickerLabel
                            prop="date"
                            label="Date"
                            onChange={(e) => setDate(formatDate(e))}
                            value={date || ''}
                        />
                    </Row>

                    <Row cols={2} className="mt-2">
                        <InputLabel label="Amount" prop="amount" type="text" placeholder="100000" onChange={(e) => {
                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                            setAmount(formatRupiah(rawValue));
                        }} value={amount} />

                        <InputLabel label="Category" prop="category" placeholder="Donation, event, zakat" onChange={(e) => setCategory(e.target.value)} value={category} />
                    </Row>

                    <Row className="mt-2">
                        <TextareaLabel label="Description" prop="description" placeholder="Receive donation from fulan" onChange={(e) => setDescription(e.target.value)} value={description} />
                    </Row>
                </form>
            </Modal>

            <Modal size="max-w-xl" isOpen={isModalVoidOpen} title="Void Cash Report" onClose={() => setIsModalVoidOpen(false)} onAccept={submitVoid}>
                <form>
                    <Row cols={2}>
                        <SelectLabel disabled={true} label="Type" prop="type" options={[{ label: "In", value: "in" }, { label: "Out", value: "out" }]} onChange={(e) => setType(e.target.value)} value={type} />

                        <DatepickerLabel
                            disabled={true}
                            prop="date"
                            label="Date"
                            onChange={(e) => setDate(formatDate(e))}
                            value={date || ''}
                        />
                    </Row>

                    <Row cols={2} className="mt-2">
                        <InputLabel disabled={true} label="Amount" prop="amount" type="text" placeholder="100000" onChange={(e) => {
                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                            setAmount(formatRupiah(rawValue));
                        }} value={amount} />

                        <InputLabel disabled={true} label="Category" prop="category" placeholder="Donation, event, zakat" onChange={(e) => setCategory(e.target.value)} value={category} />
                    </Row>

                    <Row cols={2} className="mt-2">
                        <TextareaLabel disabled={true} label="Description" prop="description" placeholder="Receive donation from fulan" onChange={(e) => setDescription(e.target.value)} value={description} />

                        <TextareaLabel label="Reason" prop="reason" placeholder="Reason for void" onChange={(e) => setReason(e.target.value)} value={reason} />
                    </Row>
                </form>
            </Modal>

            {loading && <Loading />}
        </div>
    );
};

export default Cash;