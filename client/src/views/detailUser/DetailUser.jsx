import { useEffect, useState } from "react";
import { getClient, updateClient } from "../../request/clients";
import { useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "../../utils/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions";
import styles from "./DetailUser.module.css";
import { getProductById } from "../../request/product";
import { anyErrors, validateUpdateUser } from "../../utils/validateUpdateUser";
import Name from "../../components/detailUserForm/name";
import Image from "../../components/detailUserForm/image";
import Phone from "../../components/detailUserForm/phone";
import Adress from "../../components/detailUserForm/adress";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function DetailUser({ setLogout, detailVisible, handleDetailClick }) {
  const globalUserData = useSelector((state) => state.userData);
  const auth = getAuth(firebaseApp);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getDataFromDb = async (email) => {
    const data = await getClient(email);
    const userFromDb = data.data;

    setUserData({
      id: userFromDb.id,
      name: userFromDb.fullName,
      email: userFromDb.email,
      adress: userFromDb.adress,
      phone: userFromDb.phone,
      image: userFromDb.image,
    });
  };

  const onLogout = async () => {
    setLogout(false);
    // mandar al back la info del carrito
    await getProductById(1); // esta petición es cualquier cosa, pero necesito el await. Va a ser reemplazada por la petición que guarda el carrito
    localStorage.clear();
    handleDetailClick();
    dispatch(logout());
    navigate("/");
    await signOut(auth);
  };

  useEffect(() => {
    getDataFromDb(globalUserData.email);
  }, []);

  const initialState = {
    id: "",
    name: "",
    email: "",
    adress: "",
    phone: "",
    image: "",
  };

  const [userData, setUserData] = useState(initialState);

  const [updatedData, setUpdatedData] = useState(initialState);

  const [errors, setErrors] = useState(initialState);

  const [visibleInputs, setVisibleInputs] = useState(initialState);

  const anyUpdatedData = () => {
    for (const property in updatedData) {
      if (visibleInputs[property]) return true;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await updateClient(
      { ...updatedData, fullName: updatedData.name },
      userData.id
    );
    const userFromDb = response.data;
    setUserData({
      id: userFromDb.id,
      name: userFromDb.fullName,
      email: userFromDb.email,
      adress: userFromDb.adress,
      phone: userFromDb.phone,
      image: userFromDb.image,
    });
    setVisibleInputs(initialState);
    setUpdatedData(initialState);
  };

  const handleChange = (event) => {
    const property = event.target.name;
    const value = event.target.value;
    setUpdatedData({ ...updatedData, [property]: value });
    setErrors(
      validateUpdateUser({ ...updatedData, [property]: value }, visibleInputs)
    );
  };

  const handleVisibleInputs = (event, close) => {
    const property = event.target.name;
    setVisibleInputs({
      ...visibleInputs,
      [property]: !visibleInputs[property],
    });
    if (close) {
      setUpdatedData({ ...updatedData, [property]: "" });
      setErrors({ ...errors, [property]: "" });
    } else setErrors({ ...errors, [property]: true }, visibleInputs);
  };

  return (
    <div className={styles.loginForm}>
      <div
        style={
          detailVisible
            ? { display: "flex", transition: "400ms" }
            : { display: "none", transition: "400ms" }
        }
        className={styles.overlay}
        onClick={handleDetailClick}
      ></div>

      <form onSubmit={handleSubmit} className={styles.Container}>
        {!userData.email ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <div className={styles.closeButtons}>
              <button onClick={onLogout} className={styles.closeDetailButton}>
                Logout
              </button>
              <button
                onClick={handleDetailClick}
                className={styles.closeDetailButton}
              >
                {"< Close"}
              </button>
            </div>

            <Name
              visibleInputs={visibleInputs}
              handleVisibleInputs={handleVisibleInputs}
              handleChange={handleChange}
              userData={userData}
              errors={errors}
              handleSubmit={handleSubmit}
            />

            <div className={styles.emailPropertys}>
              <h3 className={styles.value}>
                {userData.email ? userData.email : "Unknown"}
              </h3>
            </div>

            <Image
              updatedData={updatedData}
              visibleInputs={visibleInputs}
              handleVisibleInputs={handleVisibleInputs}
              userData={userData}
              errors={errors}
              setUpdatedData={setUpdatedData}
              setErrors={setErrors}
            />

            <Phone
              visibleInputs={visibleInputs}
              handleVisibleInputs={handleVisibleInputs}
              handleChange={handleChange}
              userData={userData}
              errors={errors}
              handleSubmit={handleSubmit}
            />

            <Adress
              visibleInputs={visibleInputs}
              handleVisibleInputs={handleVisibleInputs}
              handleChange={handleChange}
              userData={userData}
              errors={errors}
              handleSubmit={handleSubmit}
            />

            {anyUpdatedData() && (
              <button
                type="submit"
                className={styles.importantButton}
                disabled={anyErrors(errors)}
              >
                Submit changes
              </button>
            )}

            <hr className={styles.hr} />

            <div className={styles.finalButtons}>
              <button
                className={styles.button}
                onClick={() => {
                  navigate("/favorites");
                  handleDetailClick();
                }}
              >
                My favorites
              </button>

              <button
                className={styles.button}
                onClick={() => {
                  handleDetailClick();
                }}
              >
                My history
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default DetailUser;
