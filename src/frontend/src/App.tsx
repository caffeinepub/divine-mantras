import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import Layout from "./components/Layout";
import { AppProvider } from "./contexts/AppContext";
import DailyPage from "./pages/DailyPage";
import FavoritesPage from "./pages/FavoritesPage";
import HomePage from "./pages/HomePage";
import MantraDetailPage from "./pages/MantraDetailPage";
import MantrasPage from "./pages/MantrasPage";
import MeditationPage from "./pages/MeditationPage";
import StotraDetailPage from "./pages/StotraDetailPage";
import StotrasPage from "./pages/StotrasPage";

function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }
  }, []);
  return null;
}

const rootRoute = createRootRoute({
  component: () => (
    <AppProvider>
      <ServiceWorkerRegistrar />
      <Layout>
        <Outlet />
      </Layout>
      <Toaster position="top-center" />
    </AppProvider>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const mantrasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mantras",
  component: MantrasPage,
});

const mantraDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mantras/$id",
  component: MantraDetailPage,
});

const stotrasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stotras",
  component: StotrasPage,
});

const stotraDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stotras/$id",
  component: StotraDetailPage,
});

const meditationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/meditation",
  component: MeditationPage,
});

const dailyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/daily",
  component: DailyPage,
});

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/favorites",
  component: FavoritesPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  mantrasRoute,
  mantraDetailRoute,
  stotrasRoute,
  stotraDetailRoute,
  meditationRoute,
  dailyRoute,
  favoritesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
