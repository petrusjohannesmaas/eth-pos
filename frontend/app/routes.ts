import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("pages/AccessCode.tsx"),
    route("pos", "pages/PosScreen.tsx"),
    route("admin", "pages/AdminPanel.tsx"),
] satisfies RouteConfig;
