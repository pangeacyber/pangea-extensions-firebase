### See it in action

You can test out this extension right away!

1.  Go to your [Cloud Firestore Dashboard](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore/data) in the Firebase console.

2.  If it doesn't exist already, create a collection called `${param:COLLECTION_PATH}`.

3.  Create a document with a field named `${param:INPUT_FIELD_NAME}`, then make its value a message you want to log.

4.  In a few seconds, you'll see a new field called `${param:OUTPUT_FIELD_NAME}` pop up in the same document you just created. It will contain the Domain Intel Service response.

5.  Then, from the Pangea Console [Secure Audit Log Viewer](https://console.pangea.cloud/service/audit/logs) view the tamperproof log entry.

### Using the extension

This extension scans domain names written to the `${param:INPUT_FIELD_NAME}` field of a document in the `${param:COLLECTION_PATH}` path using the Pangea Domain Intel service. If the `${param:INPUT_FIELD_NAME}` field of the document is updated, then the updated string will be automatically scanned.


#### Input field as a string

Writing the string "google.com" to the field `${param:INPUT_FIELD_NAME}` in `${param:COLLECTION_PATH}` will result in field `${param:OUTPUT_FIELD_NAME}` being populated with something like:

```js
{
  ${param:OUTPUT_FIELD_NAME}: {
    data: {
      category: [],
      score: 0,
      verdict: 'benign'
    }
  },
}
```


### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.
