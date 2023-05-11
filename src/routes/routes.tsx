import { RouteObject } from "react-router-dom";
import { Home } from "../pages/Home";

export const AppRoutes: RouteObject[] = [
	{
		path: "/",
		element: <Home />,
	},
];
