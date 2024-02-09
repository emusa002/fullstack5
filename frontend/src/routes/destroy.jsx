// Importing the `redirect` function from `react-router-dom` to programmatically navigate the user to a different route.
import { redirect } from "react-router-dom";

// Importing the `deleteContact` function from a the service module
// for performing CRUD operations on contacts.
import { deleteContact } from "../contacts";

// Defining an asynchronous action function. This function is expected to be called in response to,
// a form submissio that signifies a request to delete a contact.
export async function action({ params }) {
    // Destructuring to get `params` from the argument, which contains URL parameters. 
    // Here, it's used to get the `contactId` parameter from the URL.

    // Awaiting the `deleteContact` function to complete. This function takes `contactId` as an argument
    // and is responsible for deleting the contact.
    await deleteContact(params.contactId);

    // After successfully deleting the contact, this line redirects the user to the root route ("/").
    // The `redirect` function creates a response that instructs the router to navigate to the specified path.
    return redirect("/");
}
