// Importing various hooks and components from react-router-dom for navigation and form handling
import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
// Importing the updateContact function from a local module to update contact details
import { updateContact } from "../contacts";

// This is an asynchronous action function to be used with react-router-dom's routing system.
// It handles form submission for updating a contact's information.
export async function action({ request, params }) {
    // Extracting form data from the request object
    const formData = await request.formData();
    // Converting the FormData entries into a simple object for easier handling
    const updates = Object.fromEntries(formData);
    // Calling updateContact with the contact ID from URL parameters and the form data
    await updateContact(params.contactId, updates);
    // Redirecting to the contact's detail page after successful update
    return redirect(`/contacts/${params.contactId}`);
}

// This is the component for rendering the edit contact form.
export default function EditContact() {
  // Using useLoaderData to access loader data, which should include the contact's current details
  const { contact } = useLoaderData();
  // useNavigate hook for programmatically navigating the user (e.g., when cancelling the form)
  const navigate = useNavigate();

  // Rendering a form for editing contact details. This form will POST to the current route.
  return (
    <Form method="post" id="contact-form">
      {/* Input fields for the contact's name, prefilled with existing values */}
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="firstName"
          defaultValue={contact.firstName}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="lastName"
          defaultValue={contact.lastName}
        />
      </p>
      {/* Input fields for the contact's Twitter handle and avatar URL, also prefilled */}
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitterUsername"
          placeholder="@username"
          defaultValue={contact.twitterUsername}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatarUrl"
          defaultValue={contact.avatarUrl}
        />
      </label>
      {/* A textarea for any notes about the contact, with existing notes prefilled */}
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact.notes}
          rows={6}
        />
      </label>
      {/* Buttons for submitting the form or cancelling the edit operation.
          The Cancel button uses the navigate function to go back to the previous page. */}
      <p>
        <button type="submit">Save</button>
        <button type="button"
        onClick={() => {
            navigate(-1); // Navigates back to the previous page in the history stack
          }}>Cancel</button>
      </p>
    </Form>
  );
}
