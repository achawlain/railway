import { createBrowserRouter, Navigate } from "react-router-dom";
import WithHeaderLayout from "../components/WithHeaderLayout";
import WithoutHeaderLayout from "../components/WithoutHeaderLayout";

import RAILWAY_CONST from "../utils/RailwayConst";
import Login from "../pages/Login";
import HomeComponent from "../components/HomeComponent";
import PrivateRoute from "../utils/PrivateRoute";
import ReportGenerateComponent from "../components/ReportGenerateComponent";
import Dashboard from "../pages/Dashboard";
import CreateReport from "../pages/CreateReport";

const router = createBrowserRouter([
  {
    element: <WithHeaderLayout />,
    children: [
      {
        path: RAILWAY_CONST.ROUTE.ROOT,
        element: <Navigate to={RAILWAY_CONST.ROUTE.REPORT_GENERATE} />,
      },
      {
        path: `${RAILWAY_CONST.ROUTE.REPORTS}/:id`,
        element: <ReportGenerateComponent />,
      },
      {
        path: RAILWAY_CONST.ROUTE.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: RAILWAY_CONST.ROUTE.CREATE_REPORT,
        element: <CreateReport />,
      },
    ],
  },
  {
    element: <WithoutHeaderLayout />,
    children: [
      { path: RAILWAY_CONST.ROUTE.LOGIN, element: <Login /> }, // ✅ Fixed Login route
      { path: RAILWAY_CONST.ROUTE.HOME, element: <HomeComponent /> },
    ],
  },
]);

export default router;
