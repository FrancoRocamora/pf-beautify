import { useState } from "react";
import styles from "./ProductsTable.module.css";
import { DataGrid } from "@mui/x-data-grid";
import CommentForm from "../commentForm/commentForm";
import AlertTwoOptions from "../alertTwoOptions/AlertTwoOptions";
import { cancelAppointment } from "../../request/appointments";
import AlertDialogSlide from "../slideDialog/slideDialog";

export default function AppointmentsTable({
  appointments,
  updateServicesComments,
  updateAppointments,
}) {
  const [wishToCancelOrModify, setWishToCancelOrModify] = useState(false);
  const [eventRowId, setEventRowId] = useState(0);
  const [feedbackServiceId, setFeedbackServiceId] = useState(0);
  const [currentServiceFeedback, setCurrentServiceFeedback] = useState(null);
  const [openFeedback, setOpenFeedback] = useState(false);

  const rows = appointments.map((row) => {
    console.log(row);
    return {
      id: row.id,
      col1: row.service,
      col2: row.profesional,
      col3: `${row.date}`,
      col4: row.hour,
      col5: row.paid || !row.ableToCancelAppointment ? "Yes" : "No",
      col6: row.ableToCancelAppointment
        ? "Cancel appointment"
        : row.comment
        ? "See your Review"
        : "Give us your opinion",
    };
  });

  const column = [
    { field: "col1", headerName: "Service", width: 200 },
    { field: "col2", headerName: "Professional", width: 200 },
    { field: "col3", headerName: "Date", width: 100 },
    { field: "col4", headerName: "Hour", width: 100 },
    { field: "col5", headerName: "Paid for", width: 100 },
    { field: "col6", headerName: "", width: 180 },
  ];

  return (
    <div className={styles.container}>
      <DataGrid
        columns={column}
        rows={rows}
        onCellClick={(e) => {
          const eventAppointment = appointments.filter(
            ({ id }) => id === e.id
          )[0];
          if (e.field === "col6") {
            if (eventAppointment.ableToCancelAppointment) {
              setEventRowId(e.id);
              setWishToCancelOrModify(true);
            } else {
              setOpenFeedback(true);
              setFeedbackServiceId(e.id);
              setCurrentServiceFeedback(eventAppointment.comment);
            }
          }
        }}
      />

      <AlertDialogSlide
        openDialog={wishToCancelOrModify}
        handleCloseDialog={() => setWishToCancelOrModify(false)}
        yesCallback={async () => {
          await cancelAppointment(eventRowId);
          await updateAppointments();
          setWishToCancelOrModify(false);
        }}
        questionText="Are you sure you wanna cancel your appoinment?"
      />

      <CommentForm
        openDialog={openFeedback}
        handleCloseDialog={() => {
          setOpenFeedback(false);
        }}
        type={"service"}
        id={feedbackServiceId}
        comment={currentServiceFeedback}
        updateServicesComments={updateServicesComments}
      />
    </div>
  );
}
