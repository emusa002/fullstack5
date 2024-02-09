// Importing necessary modules from React and ReactDOM libraries for UI rendering
import * as React from "react";
import * as ReactDOM from "react-dom/client";

// Importing routing functionalities from the react-router-dom package
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importing CSS for global styling
import "./index.css";

// Importing components and functions from various route files
import Root, { loader as rootLoader, action as rootAction } from "./routes/root";
import ErrorPage from "./error-page";
import Contact, { loader as contactLoader, action as contactAction } from "./routes/contact";
import EditContact, { action as editAction } from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import Index from "./routes/index";

// Creating a router instance using createBrowserRouter. This configures the routes for the application.
const router = createBrowserRouter([
  {
    path: "/", // The root path
    element: <Root />, // The component that will be rendered at the root path
    errorElement: <ErrorPage />, // The component that will be rendered in case of an error at this route
    loader: rootLoader, // The loader function for fetching initial data needed by the root route
    action: rootAction, // The action function for handling form submissions at the root route
    children: [
      // Nested routes under the root path
      {
        errorElement: <ErrorPage />, // Error component for nested routes
        children: [
          { index: true, element: <Index /> }, // The default child route of the root path
          {
            path: "contacts/:contactId", // Path for individual contact details, with a dynamic segment for the contact ID
            element: <Contact />, // Component to render for this path
            loader: contactLoader, // Loader function for fetching data specific to a contact
            action: contactAction, // Action function for this route
          },
          {
            path: "contacts/:contactId/edit", // Path for editing a contact
            element: <EditContact />, // Component to render for the edit page
            loader: contactLoader, // Reusing the contact loader for fetching data needed for editing
            action: editAction, // Action function for handling the edit form submission
          },
          {
            path: "contacts/:contactId/destroy", // Path for deleting a contact
            action: destroyAction, // Action function for handling contact deletion
            errorElement: <div>Oops! There was an error.</div>, // Error component for this specific route
          },
        ],
      }
    ],
  },
]);

// Creating the root of the application with ReactDOM, and rendering the application within React StrictMode.
// React StrictMode is a tool for highlighting potential problems in an application. It does not render any visible UI.
// It activates additional checks and warnings for its descendants.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} /> {/* RouterProvider makes the routing context available to the rest of the app */}
  </React.StrictMode>
);
