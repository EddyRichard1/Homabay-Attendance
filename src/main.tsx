import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

import { navigateTo } from "./lib/utils";
import { CONFIG } from "./lib/config";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!convexUrl || !PUBLISHABLE_KEY) {
  throw new Error(
    "Missing VITE_CONVEX_URL or VITE_CLERK_PUBLISHABLE_KEY. Set both in Netlify environment variables, then redeploy.",
  );
}

const convex = new ConvexReactClient(convexUrl);

const allowedRedirectOrigins = [
  "http://localhost:5173",
  new URL(CONFIG.PUBLIC_URL).origin,
  window.location.origin,
];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      allowedRedirectOrigins={allowedRedirectOrigins}
      routerPush={(to) => navigateTo(to)}
      routerReplace={(to) => {
        window.history.replaceState({}, "", to);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>
);
