import { createBrowserRouter, Navigate } from "react-router-dom";
import WithHeaderLayout from "../components/WithHeaderLayout";
import WithoutHeaderLayout from "../components/WithoutHeaderLayout";

import RAILWAY_CONST from "../utils/RailwayConst";
import Login from "../pages/Login";
import HomeComponent from "../components/HomeComponent";
import PrivateRoute from "../utils/PrivateRoute";
import ReportGenerateComponent from "../components/ReportGenerateComponent";

const router = createBrowserRouter([
  {
    element: <WithHeaderLayout />,
    children: [
      {
        path: RAILWAY_CONST.ROUTE.ROOT,
        element: <Navigate to={RAILWAY_CONST.ROUTE.REPORT_GENERATE} />,
      },
      {
        path: RAILWAY_CONST.ROUTE.REPORT_GENERATE,
        element: <ReportGenerateComponent />,
      },
      // {
      //   path: RAILWAY_CONST.ROUTE.DASHBOARD,
      //   element: <PrivateRoute element={<DashboardComponent />} />,
      // },
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
