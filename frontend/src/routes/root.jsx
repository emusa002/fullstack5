// Importing hooks and components from react-router-dom and React for routing, data loading, and effects
import { Outlet, NavLink, useLoaderData, Form, redirect, useNavigation, useSubmit } from "react-router-dom";
import { getContacts, createContact } from "../contacts"; // Importing functions to handle contact data
import { useEffect } from "react"; // React hook for side effects

// Asynchronous action to create a new contact
export async function action() {
    const contact = await createContact(); // Creating a contact
    return redirect(`/contacts/${contact.id}/edit`); // Redirecting to the edit page for the new contact
}

// Asynchronous loader function to fetch contacts based on a query
export async function loader({ request }) {
    const url = new URL(request.url); // Parsing the URL to access query parameters
    const q = url.searchParams.get("q"); // Getting the search query, if any
    const contacts = await getContacts(q); // Fetching contacts based on the search query
    return { contacts, q }; // Returning contacts and the search query for the component
}

// The root component that displays the contacts and an outlet for nested routes
export default function Root() {
    const { contacts, q } = useLoaderData(); // Using loader data to get contacts and query
    const navigation = useNavigation(); // Hook to access the current navigation state
    const submit = useSubmit(); // Hook to programmatically submit forms

    // Boolean to determine if a search is currently being performed
    const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

    // Effect to update the search input value based on the current query
    useEffect(() => {
        document.getElementById("q").value = q || '';
    }, [q]);

    // The component renders a sidebar with search functionality and a list of contacts
    // and an outlet for displaying the selected contact's details or forms for creating/editing contacts
    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    {/* Form for searching contacts */}
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}
                            onChange={(event) => {
                                // Submit the form on search query change, replacing URL if not the first search
                                const isFirstSearch = q == null;
                                submit(event.currentTarget.form, {
                                    replace: !isFirstSearch,
                                });
                            }}
                            className={searching ? "loading" : ""}
                        />
                        {/* Spinner shown when searching */}
                        <div id="search-spinner" aria-hidden hidden={!searching} />
                    </Form>
                    {/* Form for creating a new contact */}
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                {/* Navigation links to each contact */}
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id}>
                                    {/* NavLink to make each contact link active when selected */}
                                    <NavLink
                                        to={`contacts/${contact.id}`}
                                        className={({ isActive, isPending }) =>
                                            isActive ? "active" : isPending ? "pending" : ""
                                        }
                                    >
                                        {contact.firstNameName || contact.lastName ? `${contact.firstName} ${contact.lastName}` : <i>No Name</i>} 
                                        {contact.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p><i>No contacts</i></p>
                    )}
                </nav>
            </div>
            <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
                {/* Outlet for rendering child routes components */}
                <Outlet />
            </div>
        </>
    );
}
