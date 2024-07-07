import React from "react";
import { QueryClientProvider } from "react-query";
import * as Sentry from "@sentry/react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "./i18n";
import { ReactQueryDevtools } from "react-query/devtools";
import queryClient from "api/query-client";
import config from "config";
import Main from "MainRouter";

Sentry.init({
  dsn: config.SENTRY_DSN,
  enabled: config.ENABLE_SENTRY,
  environment: config.SENTRY_ENV,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.5,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Main />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
