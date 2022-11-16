### See it in action

You can test out this extension right away!

1.  Go to your [Cloud Firestore Dashboard](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore/data) in the Firebase console.

2.  If it doesn't exist already, create a collection called `${param:COLLECTION_PATH}`.

3.  Create a document with a field named `${param:INPUT_FIELD_NAME}`, then make its value a message you want to log.

4.  In a few seconds, you'll see a new field called `${param:OUTPUT_FIELD_NAME}` pop up in the same document you just created. It will contain the Secure Audit Log Service response.

5.  Then, from the Pangea Console [Secure Audit Log Viewer](https://console.pangea.cloud/service/audit/logs) view the tamperproof log entry.

### Using the extension

This extension logs strings written to the `${param:INPUT_FIELD_NAME}` field of a document in the `${param:COLLECTION_PATH}` path using the Pangea Secure Audit Logging service. Tamperproof logs can be viewed anytime from the Pangea Console [Secure Audit Log Viewer](https://console.pangea.cloud/service/audit/logs). If the `${param:INPUT_FIELD_NAME}` field of the document is updated, then the updated string will be automatically logged as a new log entry.


#### Input field as a string

Write the string "Login attempt from user Bob" to the field `${param:INPUT_FIELD_NAME}` in `${param:COLLECTION_PATH}` will result in the following output in  `${param:OUTPUT_FIELD_NAME}`:

```js
{
  ${param:INPUT_FIELD_NAME}: "Login attempt from user Bob",
  ${param:OUTPUT_FIELD_NAME}: {
    hash: "ad31e03f4a0be24ff6b7e1009a5c584990ab1503d6f2b9bb996d2900edcb435e",
    signature_verification: "none",
  },
}
```

#### Input field as a map of input strings

Create or update a document in `${param:COLLECTION_PATH}` with the field `${param:INPUT_FIELD_NAME}` value like the following:

```js
{
  first: "Login attempt from user Bob",
  second: "Login attempt from user Alice",
}
```

will result in the following translated output in `${param:OUTPUT_FIELD_NAME}`:

```js
{
  ${param:INPUT_FIELD_NAME}: {
    first: "Login attempt from user Bob",
    second: "Login attempt from user Alice",
  },

  ${param:OUTPUT_FIELD_NAME}: {
    first: {
      hash: "ad31e03f4a0be24ff6b7e1009a5c584990ab1503d6f2b9bb996d2900edcb435e",
      signature_verification: "none",
    },
    second: {
      hash: "68fa2ebdc1db323157f3043fce694eb1e095c273fc4d88e77d726e599f330639",
      signature_verification: "none",
    },   
  },
}
```

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.
