
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "../src/routes";
import '../src/styles/globals.css'
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
