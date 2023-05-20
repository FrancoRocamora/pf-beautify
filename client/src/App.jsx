import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Landing from "./views/landing/Landing";
import Home from "./views/home/Home";
import About from "./views/about/About";
import Cart from "./views/cart/Cart";
import Products from "./views/products/Products";
import Services from "./views/services/Services";
import DashboardAdmin from "./views/dashboardAdmin/DashboardAdmin";
import DetailProduct from "./views/detailProduct/DetailProduct";
import DetailPayment from "./views/detailPayment/DetailPayment";
import DetailUser from "./views/detailUser/DetailUser";
import Nav from "./components/nav/Nav";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  getAllProducts,
  setUserInfoAction,
} from "./redux/actions";
import useGetProducts from "./hooks/useGetProducts";
import { useEffect } from "react";
import useGetCategories from "./hooks/useGetCategories";
import NewProduct from "./views/newProduct/NewProduct";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import useToggle from "./hooks/useToggle";
import { loginWithGoogleFirebase } from "./utils/firebaseConfig";
import { getClient } from "./request/clients";
import Login from "./components/login/Login";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import { CLIENT, INVITED, ADMIN } from "./utils/roles";

function App() {
  const locationNow = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products] = useGetProducts();
  const [categories] = useGetCategories();

  // sirve para saber si el usuario no está logueado (true), se usa para prevenir que se guarde la información del usuario cuando este se está deslogueando (archivo firebaseConfig)
  const [logout, setLogout] = useToggle(true);

  // sirve para mostrar y ocultar el formulario de login y detail
  const [loginVisible, setLoginVisible] = useToggle(false);
  const [detailVisible, setDetailVisible] = useToggle(false);

  // sirve para distinguir si el usuario está registrándose (true) o iniciando sesión
  const [creatingAccount, setCreatingAccount] = useToggle(false);
  const auth = getAuth();
  const userData = useSelector((state) => state.userData);

  const handleLoginClick = () => {
    setLoginVisible(!loginVisible);
  };

  const handleDetailClick = () => {
    setDetailVisible(!detailVisible);
  };

  useEffect(() => {
    dispatch(getAllCategories(categories));
    dispatch(getAllProducts(products));
  }, [dispatch, products, categories]);

  // esta función se ejecuta cuando detecta un cambio en el usuario de firebase
  onAuthStateChanged(auth, async (usuarioFirebase) => {
    // las tres condiciones: hubo un cambio en la auth, el usuario recibido es de google, antes no había usuario logueado
    // la intención de estas condiciones es que sólo se ejecute la función cuando el usuario esté logueándose con Google
    if (
      usuarioFirebase &&
      usuarioFirebase.displayName &&
      !userData.email &&
      logout
    ) {
      await loginWithGoogleFirebase(
        usuarioFirebase,
        dispatch,
        navigate,
        locationNow
      );
      setLogout(false);
    } else if (
      // login usuarios de mail
      usuarioFirebase &&
      !usuarioFirebase.displayName &&
      !userData.email &&
      !creatingAccount
    ) {
      // esto trae la info desde el local storage cuando se relodea la pag y la manda al estado local
      const userData = JSON.parse(localStorage.getItem("userData")) || {};

      if (userData) {
        dispatch(setUserInfoAction(userData));
      }
    }
  });

  return (
    <div className="App">
      {locationNow.pathname !== "/" && (
        <Nav
          handleLoginClick={handleLoginClick}
          handleDetailClick={handleDetailClick}
        />
      )}

      {loginVisible && (
        <Login
          loginVisible={loginVisible}
          handleLoginClick={handleLoginClick}
          creatingAccount={creatingAccount}
          setCreatingAccount={setCreatingAccount}
        />
      )}

      {detailVisible && (
        <DetailUser
          setLogout={setLogout}
          detailVisible={detailVisible}
          handleDetailClick={handleDetailClick}
        />
      )}

      <Routes>
        {/* Rutas que tiene acceso cualquiera */}
        <Route
          path="/"
          element={
            <Landing
              handleLoginClick={handleLoginClick}
              loginVisible={loginVisible}
            />
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/services" element={<Services />} />
        <Route
          path="/detailProduct/:id"
          element={<DetailProduct handleLoginClick={handleLoginClick} />}
        />

        {/* Rutas solo para ADMIN */}
        <Route element={<ProtectedRoute isAllowed={userData.rol === ADMIN} />}>
          <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
          <Route path="/newProduct" element={<NewProduct />} />
        </Route>
        {/* Rutas solo para CLIENT */}
        {/* <Route element={<ProtectedRoute isAllowed={userData.rol === CLIENT} />}>
          <Route
            path="/detailUser"
            element={<DetailUser setLogout={setLogout} />}
          />
        </Route> */}
        {/* Rutas para CLIENT Y ADMIN*/}
        <Route
          element={
            <ProtectedRoute
              isAllowed={userData.rol === ADMIN || userData.rol === CLIENT}
            />
          }
        >
          <Route path="/detailPayment" element={<DetailPayment />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
