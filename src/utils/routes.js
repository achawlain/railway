import { createBrowserRouter, Navigate } from "react-router-dom";
import WithHeaderLayout from "../components/WithHeaderLayout";
import WithoutHeaderLayout from "../components/WithoutHeaderLayout";

import RAILWAY_CONST from "../utils/RailwayConst";
import Login from "../pages/Login";
import HomeComponent from "../components/HomeComponent";
import SuperAdmin from "../components/superadmin";
import OrgDetails from "../components/OrgDetails";
import PrivateRoute from "../utils/PrivateRoute";
import ReportGenerateComponent from "../components/ReportGenerateComponent";
import Dashboard from "../pages/Dashboard";
import ControlCenter from "../pages/ControlCenter";
import CreateReport from "../pages/CreateReport";
import { getDataFromLocalStorage } from "./localStorage";
import Template from "../pages/Template";
import CreateTemplateComponent from "../components/CreateTemplateComponent";
import UpdateTemplateComponent from "../components/UpdateTemplateComponent";
import Reports from "../pages/Reports";
import Profile from "../pages/Profile";
import ForgetPassword from "../components/ForgetPassword";
import RouteList from "../pages/RouteList";
import NotFoundPage from "../pages/NotFoundPage";
import TemplateDetails from "../pages/TemplateDetails";

const user = getDataFromLocalStorage("userInfo");

const router = createBrowserRouter([
  {
    element: <WithHeaderLayout />,
    children: [
      {
        path: RAILWAY_CONST.ROUTE.ROOT,
        element: (
          <Navigate
            to={user ? RAILWAY_CONST.ROUTE.HOME : RAILWAY_CONST.ROUTE.HOME}
          />
        ),
      },
      {
        path: `${RAILWAY_CONST.ROUTE.REPORTS}/:id`,
        element: <PrivateRoute element={<ReportGenerateComponent />} />,
      },
      {
        path: `${RAILWAY_CONST.ROUTE.CREATE_TEMPLATE}`,
        element: <PrivateRoute element={<CreateTemplateComponent />} />,
      },
      {
        path: `${RAILWAY_CONST.ROUTE.UPDATE_TEMPLATE}`,
        element: <PrivateRoute element={<UpdateTemplateComponent />} />,
      },
      {
        path: RAILWAY_CONST.ROUTE.DASHBOARD,
        element: <PrivateRoute element={<Dashboard />} />,
      },
      {
        path: RAILWAY_CONST.ROUTE.TEMPLATE,
        element: <PrivateRoute element={<Template />} />,
      },
      {
        path: RAILWAY_CONST.ROUTE.CREATE_REPORT,
        element: <PrivateRoute element={<CreateReport />} />,
      },
      {
        path: `${RAILWAY_CONST.ROUTE.TEMPLATE_DETAIL}/:id`,
        element: <PrivateRoute element={<TemplateDetails />} />
      },
      { path: RAILWAY_CONST.ROUTE.HOME, element: <HomeComponent /> },
      { path: RAILWAY_CONST.ROUTE.SUPERADMIN, element: <SuperAdmin /> },
      { path: RAILWAY_CONST.ROUTE.ORGDETAILS, element: <OrgDetails /> },
      {
        path: RAILWAY_CONST.ROUTE.REPORTS,
        element: <PrivateRoute element={<Reports />} />,
      },
      
      {
        path: RAILWAY_CONST.ROUTE.CONTROL_CENTER,
        element: <PrivateRoute element={<ControlCenter />} />,
      },
      {
        path: RAILWAY_CONST.ROUTE.PROFILE,
        element: <PrivateRoute element={<Profile />} />,
      },
      {
        path: RAILWAY_CONST.ROUTE.ROUTELIST,
        element: <PrivateRoute element={<RouteList />} />,
      },
      {
        path: RAILWAY_CONST.ROUTE.NOT_FOUND,
        element: <NotFoundPage />, // ✅
      },
    ],
  },
  {
    element: <WithoutHeaderLayout />,
    children: [
      { path: RAILWAY_CONST.ROUTE.LOGIN, element: <Login /> },
      { path: RAILWAY_CONST.ROUTE.FORGETPASSWORD, element: <ForgetPassword /> }, // ✅ Fixed Forget Password route
      // ✅ Fixed Login route
    ],
  },
]);

export default router;
