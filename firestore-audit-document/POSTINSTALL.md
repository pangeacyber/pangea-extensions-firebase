### See it in action

You can test out this extension right away!

1.  Go to your [Cloud Firestore Dashboard](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore/data) in the Firebase console.

2.  If it doesn't exist already, create a collection called `${param:COLLECTION_PATH}`.

3.  Create a document that contains some or all of the following fields `${param:FIELDS_TO_AUDIT}`

4.  Navigate to [Pangea Audit Log Console][] to view the audit log of your document.

### Using the extension

Listens to Firestore events for `${param:COLLECTION_PATH}` collection and when a document in the collection changes, the extension will check whether the update includes the fields that you'd like to audit, if so, the new values will be logged to Pangea's Secure Audit Log service.

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.

[Pangea Audit Log Console]: https://console.pangea.cloud/service/audit/logs?utm_medium=marketplace&utm_source=firebase&utm_campaign=firestore-sensitive-document-audit
