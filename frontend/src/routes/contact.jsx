// Importing necessary hooks and components from react-router-dom for form handling and data loading
import { Form, useLoaderData, useFetcher } from "react-router-dom";
// Importing functions to interact with the contacts data
import { getContact, updateContact } from "../contacts";

// Loader function to fetch data before rendering the component. This is specific to react-router's data loading pattern.
export async function loader({ params }) {
    // Attempting to fetch contact details using the contact ID from the URL parameters
    const contact = await getContact(params.contactId);
    // If no contact is found, throw a 404 error to be handled by react-router's error handling mechanisms
    if (!contact) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        });
    }
    // Return the contact data which will be accessible to the component via useLoaderData
    return { contact };
}

// Action function to handle form submissions for updating contact details
export async function action({ request, params }) {
    // Parsing the form data from the request
    let formData = await request.formData();
    // Updating the contact's 'favorite' status based on the form data and returning the operation's result
    return updateContact(params.contactId, {
        favorite: formData.get("favorite") === "true",
    });
}

// The main component for displaying contact details
export default function Contact() {
    // Loading the contact data made available by the loader function
    const { contact } = useLoaderData();

    // The UI for displaying the contact's details, including avatar, name, Twitter handle, and notes
    return (
        <div id="contact">
            <div>
                {/* Conditionally displaying the contact's avatar if available */}
                <img
                    key={contact.avatarUrl}
                    src={contact.avatarUrl || null}
                />
            </div>

            <div>
                <h1>
                    {/* Displaying the contact's name, or 'No Name' if not available */}
                    {contact.firstName || contact.lastName ? (
                        <>
                            {contact.firstName} {contact.lastName}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    {/* Embedding the Favorite component to handle favorite status */}
                    <Favorite contact={contact} />
                </h1>

                {/* Displaying the contact's Twitter handle as a link if available */}
                {contact.twitterUsername && (
                    <p>
                        <a
                            target="_blank"
                            rel="noopener noreferrer" // Added for security reasons when using target="_blank"
                            href={`https://twitter.com/${contact.twitterUsername}`}
                        >
                            {contact.twitterUsername}
                        </a>
                    </p>
                )}

                {/* Displaying any notes associated with the contact */}
                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    {/* Form for navigating to the edit page */}
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    {/* Form for deleting the contact with a confirmation prompt */}
                    <Form
                        method="post"
                        action="destroy"
                        onSubmit={(event) => {
                            if (!confirm("Please confirm you want to delete this record.")) {
                                event.preventDefault(); // Prevent form submission if the user cancels
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

// The Favorite component allows toggling a contact's favorite status
function Favorite({ contact }) {
    const fetcher = useFetcher(); // Using the useFetcher hook for background data fetching
    let favorite = contact.favorite; // Initial favorite state

    // If there's form data in the fetcher, update the favorite state based on that
    if (fetcher.formData) {
        favorite = fetcher.formData.get("favorite") === "true";
    }
    // Render a form that, when submitted, toggles the contact's favorite status
    return (
        <fetcher.Form method="post">
            <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
                {favorite ? "★" : "☆"} {/* Displaying a star icon based on favorite status */}
            </button>
        </fetcher.Form>
    );
}
