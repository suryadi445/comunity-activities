import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Pagination } from "flowbite-react";
import { useEffect, useState } from "react";
import Row from "../components/Row";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../contexts/UserContext";
import { getPermissionsByRoute } from "../utils/getPermissionsByRoute";
import { useLocation } from "react-router-dom";

const TableComponent = ({
    columns,
    fetchData,
    showEdit = false,
    showDelete = false,
    onEdit,
    onDelete,
    limit = 10,
    tooltip = ""
}) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    // permission
    const { user } = useUser();
    const { pathname } = useLocation();

    const permissions = getPermissionsByRoute(user, pathname);

    const canEdit = permissions.includes("update");
    const canDelete = permissions.includes("delete");
    const canRead = permissions.includes("read");

    const roleId = user?.roles?.[0]?.id;
    const canShowEdit = showEdit && (canEdit || roleId === 1 || roleId === 2);
    const canShowDelete = showDelete && (canDelete || roleId === 1 || roleId === 2);

    const actionCount = (canShowEdit ? 1 : 0) + (canShowDelete ? 1 : 0);

    const loadData = async (page = 1) => {
        setLoading(true);
        try {
            let result;

            if (typeof fetchData === "function") {
                result = await fetchData(page, limit);
            } else if (Array.isArray(fetchData)) {
                result = { data: fetchData, last_page: 1 };
            } else {
                result = { data: [], last_page: 1 };
            }

            const fetchedData = Array.isArray(result?.data) ? result.data : [];
            const fetchedLastPage =
                typeof result?.last_page === "number" ? result.last_page : 1;

            setData(fetchedData);
            setTotalPages(fetchedLastPage);
        } catch (e) {
            setData([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!canRead && roleId !== 1 && roleId !== 2) {
            setData([]);
            setTotalPages(1);
            setLoading(false);
        } else {
            loadData(currentPage);
        }
    }, [currentPage, fetchData]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <Table striped hoverable className="text-center">
                    <TableHead>
                        <TableHeadCell>No</TableHeadCell>
                        {columns.map((col) => (
                            <TableHeadCell key={col.key}>{col.label}</TableHeadCell>
                        ))}
                        {(canShowEdit || canShowDelete) && <TableHeadCell>
                            Action
                        </TableHeadCell>}
                    </TableHead>
                    <TableBody className="divide-y">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 2}>
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : !Array.isArray(data) || data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 2}>
                                    No data
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, idx) => (
                                <TableRow key={item.id || idx}>
                                    <TableCell>{(currentPage - 1) * limit + idx + 1}</TableCell>
                                    {columns.map((col) => (
                                        <TableCell key={col.key}>
                                            {col.render ? col.render(item[col.key], item) : item[col.key]}
                                        </TableCell>
                                    ))}
                                    {(canShowEdit || canShowDelete) && (
                                        <TableCell>
                                            <Row cols={actionCount}>
                                                {canShowEdit && (
                                                    <Button
                                                        color="blue"
                                                        size="small"
                                                        tooltipContent={"Edit " + tooltip || "Edit"}
                                                        tooltipId={tooltip + idx}
                                                        onClick={() => onEdit && onEdit(item)}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPen}
                                                            className="text-sm text-white"
                                                        />
                                                    </Button>
                                                )}
                                                {canShowDelete && (
                                                    <Button
                                                        color="red"
                                                        size="small"
                                                        tooltipContent={"Delete " + tooltip || "Delete"}
                                                        tooltipId={tooltip + idx}
                                                        onClick={() => onDelete && onDelete(item)}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                            className="text-sm text-white"
                                                        />
                                                    </Button>
                                                )}
                                            </Row>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex overflow-x-auto justify-center mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        showIcons
                    />
                </div>
            )}
        </div>
    );
};

export default TableComponent;
