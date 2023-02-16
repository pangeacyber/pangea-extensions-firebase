const messages = {
    'init': 'Initializing extension with the parameter values',
    'start': 'Started execution of extension with configuration',
    'complete': 'Completed execution of extension successfully',
    'serviceCallStart': 'Calling the Pangea Secure Audit Log service',
    'serviceCallComplete': 'Received response from the Pangea Secure Audit Log service',
    'updateDocumentStart': 'Updating Cloud Firestore document',
    'updateDocumentComplete': 'Updated Cloud Firestore document',

    // Errors
    'genericError': 'Error occurred while executing the extension',
    'fieldNamesNotDifferent': 'The `Input` and `Output` field names must be different for this extension to function correctly',
    'incorrectValueType': 'The value should be of type `string`',
    'valueNotChanged': 'The value of the field has not changed',
};

export default messages;