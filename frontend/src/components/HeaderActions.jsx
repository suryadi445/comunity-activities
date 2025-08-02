import Row from "../components/Row";
import Button from "../components/Button";
import Search from "../components/Search";
import { FaPlus } from "react-icons/fa";
import 'react-tooltip/dist/react-tooltip.css';
import { useUser } from "../contexts/UserContext";
import { getPermissionsByRoute } from "../utils/getPermissionsByRoute";
import { useLocation } from "react-router-dom";
import SelectLabel from "../components/SelectLabel";
import DatepickerLabel from "./DatepickerLabel";

const HeaderActions = ({
    searchValue = "",
    onSearchChange,
    onSearchClick,
    searchPlaceholder = "Search...",
    tooltip = "",
    tooltipId = "add-button-tooltip",
    onButtonClick,
    cols = 2,
    buttonAdd = false,
    inputSearch = true,
    filter = []
}) => {
    const { user } = useUser();
    const { pathname } = useLocation();
    const roleId = user?.roles?.[0]?.id;
    const permissions = getPermissionsByRoute(user, pathname);

    const canShowButton = buttonAdd && (permissions.includes("create") || roleId === 1 || roleId === 2);

    return (
        <>
            <Row className="mb-4 items-center" cols={cols}>
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-end gap-4 w-full">
                    {inputSearch && (
                        <div className="relative">
                            <Search
                                value={searchValue}
                                onChange={onSearchChange}
                                onClick={onSearchClick}
                                placeholder={searchPlaceholder}
                            />
                        </div>
                    )}

                    {filter.map((select, index) => (
                        <div key={index} className="relative">
                            {select.type === "date" ? (
                                <DatepickerLabel
                                    label={select.label}
                                    value={select.value}
                                    onChange={select.onChange}
                                    className={select.className}
                                />
                            ) : (
                                <SelectLabel
                                    label={select.label}
                                    prop={select.prop}
                                    value={select.value}
                                    onChange={select.onChange}
                                    options={select.options}
                                    className={select.className}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Button di kolom kedua */}
                {canShowButton && (
                    <div className="flex justify-end w-full">
                        <Button color="green" className="rounded-full w-10 h-10 flex items-center justify-center p-0"
                            onClick={onButtonClick}
                            tooltipContent={tooltip}
                            tooltipId={tooltipId}
                        >
                            <FaPlus />
                        </Button>
                    </div>
                )}
            </Row>
        </>
    );
};

export default HeaderActions;
