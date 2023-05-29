import { useEffect, useState } from "react";
import styles from "./ProductsTable.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { getProducts } from "../../request/product";
import { useNavigate } from "react-router-dom";
import AlertDialogSlide from "../slideDialog/slideDialog";
import { cancelShop } from "../../request/shops";
import ScrollDialog from "./ProductsDetailsTable";
import CommentForm from "../commentForm/commentForm";

export default function ProductsHistoryTable({ shops, setShops }) {
  const [wishToCancel, setWishToCancel] = useState(false);
  const [eventRowId, setEventRowId] = useState(0);
  const [openDetail, setOpenDetail] = useState(false);
  const [feedbackProductId, setFeedbackProductId] = useState(0);
  const [currentProductFeedback, setCurrentProductFeedback] = useState(null);
  const [openFeedback, setOpenFeedback] = useState(false);

  const rows = shops.map((row) => {
    return {
      id: row.id,
      col1: row.date,
      col2: row.amount,
      col3: `${row.discount}`,
      col4: row.productsNames,
      col6: row.ableToCancelShop ? "Cancel purchase" : "",
    };
  });

  const column = [
    { field: "col1", headerName: "Date", width: 100 },
    { field: "col2", headerName: "Ammount", width: 100 },
    { field: "col3", headerName: "Discount", width: 100 },
    {
      field: "col4",
      headerName: "Products (Click to see details)",
      width: 400,
    },
    { field: "col6", headerName: "", width: 150 },
  ];

  return (
    <div className={styles.container}>
      <DataGrid
        columns={column}
        rows={rows}
        pageSize={15}
        onCellClick={(e) => {
          setEventRowId(e.id);
          e.field === "col4" && setOpenDetail(true);
          e.field === "col6" && setWishToCancel(true);
        }}
      />

      <AlertDialogSlide
        openDialog={wishToCancel}
        handleCloseDialog={() => {
          setWishToCancel(false);
        }}
        yesCallback={() => {
          cancelShop(eventRowId);
          setWishToCancel(false);
          setShops(shops.filter(({ id }) => id !== eventRowId));
        }}
        questionText={
          "Are you sure you wanna cancel your purchase?\nA proportional discount would be granted to you so you can keep shoping in our web site"
        }
      />

      <CommentForm
        openDialog={openFeedback}
        handleCloseDialog={() => {
          setOpenFeedback(false);
        }}
        yesCallback={() => {
          console.log();
        }}
        comment={currentProductFeedback}
      />

      <ScrollDialog
        setCurrentProductFeedback={setCurrentProductFeedback}
        setOpenFeedback={setOpenFeedback}
        setFeedbackProductId={setFeedbackProductId}
        open={openDetail}
        handleClose={() => setOpenDetail(false)}
        shopData={shops.filter(({ id }) => id === eventRowId)[0]}
      />
    </div>
  );
}
// {/* <Button onClick={handleClickOpen("paper")}>scroll=paper</Button> */}
// const handleClickOpen = (scrollType) => () => {
//   setOpen(true);
// };

// const handleClose = () => {
//   setOpen(false);
// };
