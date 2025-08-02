const formatRupiah = (value) => {
    if (isNaN(value)) return value;
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
};

export default formatRupiah;
