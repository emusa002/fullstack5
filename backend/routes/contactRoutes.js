const express = require('express');
const { body, query, validationResult, matchedData } = require('express-validator');
const Contact = require('../models/contactModels');

const router = express.Router();

// @route    POST api/contacts
// @desc     Create a new contact
// @access   Public
router.post('/', [
    body('firstName', 'Please enter a vaild firstname').optional().trim(),
    body('lastName', 'Please enter a valid lastname').optional().trim(),
    body('twitterUsername', 'Please enter a vaild username').optional().trim(),
    body('avatarUrl', 'Please enter a vaild url').optional().trim().isURL(),
    body('notes', 'Please enter a valid note').optional(),
    body('favorite').optional().isBoolean()
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    // Get only the validated data
    const validatedData = matchedData(req);


    try {
        contact = new Contact(validatedData);

        await contact.save();

        res.status(201).json({ msg: 'Contact created successfully', data: contact });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

// @route    GET api/contacts
// @desc     Get all contacts
// @access   Public
router.get('/', [
    query('search').optional().isString().trim()
], async (req, res) => {
    // Perform validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Access validated data
    const validated = matchedData(req, { locations: ['query'] });
    const { search } = validated;

    try {
        let query = {};

        if (search) {
            query = {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const contacts = await Contact.find(query);
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route    GET api/contacts/:contactId
// @desc     Get a contact
// @access   Public
router.get('/:contactId', async (req, res) => {
    const { contactId } = req.params;

    try {
        const contact = await Contact.findById(contactId);

        if (!contact) {
            return res.status(404).json({ msg: 'Contact not found' });
        }

        res.json(contact);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid contact ID' });
        }
        res.status(500).send('Server error');
    }
});

// @route    PATCH api/contacts/:id
// @desc     Update a contact
// @access   Public
router.patch('/:contactId', [
    body('firstName').optional().trim().notEmpty().withMessage('Please enter a valid firstname'),
    body('lastName').optional().trim().notEmpty().withMessage('Please enter a valid lastname'),
    body('twitterUsername').optional().trim().notEmpty().withMessage('Please enter a valid username'),
    body('avatarUrl').optional().trim().isURL().withMessage('Please enter a valid URL'),
    body('notes').optional().trim(),
    body('favorite').optional().isBoolean()
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get only the validated data
    const validatedData = matchedData(req);
    const { contactId } = req.params;

    try {
        // Use `findByIdAndUpdate` with the option `{new: true}` to return the updated document
        const contact = await Contact.findByIdAndUpdate(contactId, validatedData, { new: true, runValidators: true });

        if (!contact) {
            return res.status(404).json({ msg: 'Contact not found' });
        }

        res.json({ msg: 'Contact updated successfully', data: contact });
    } catch (err) {
        console.error(err.message);
        // Handle the case where the `contactId` might not be a valid ObjectId
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Contact not found' });
        }
        res.status(500).send('Server error');
    }
});


// @route    DELETE api/contacts/:id
// @desc     Delete a contact
// @access   Public
// @route    DELETE api/contacts/:id
// @desc     Delete a contact
// @access   Public
router.delete('/:contactId', async (req, res) => {
    const { contactId } = req.params;

    try {
        // Correctly use deleteOne() by specifying the criteria in an object
        const result = await Contact.deleteOne({ _id: contactId });

        // Check if a document was deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Contact not found' });
        }

        // 204 No Content is typically used when an operation successfully completes but has no message body
        res.status(204).end();

    } catch (err) {
        console.error(err.message);
        // This specific error handling for `ObjectId` is not accurate for Mongoose errors
        // A more appropriate check would be:
        if (err.name === 'CastError') {
            return res.status(404).json({ msg: 'Contact not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;