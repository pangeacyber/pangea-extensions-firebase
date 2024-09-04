### See it in action

You can test out this extension right away!

1.  From the Pangea Console [Redact Dashboard][] enable and configure the Redact Rulesets

2.  Go to your [Cloud Firestore Dashboard](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore/data) in the Firebase console.

3.  If it doesn't exist already, create a collection called `${param:COLLECTION_PATH}`.

4.  Create a document with a field named `${param:INPUT_FIELD_NAME}`, then make its value a word or phrase that you want to translate.

5.  In a few seconds, you'll see a new field called `${param:OUTPUT_FIELD_NAME}` pop up in the same document you just created. It will contain the redacted version of the string based on the rulesets defined.

### Using the extension

This extension redacts text from the input string(s) based on the ruleset defined. Rulesets can be configured and changed anytime from the Pangea Console [Redact Dashboard][]. If the `${param:INPUT_FIELD_NAME}` field of the document is updated, then the redactions will be automatically updated as well.

#### Input field as a string

Write the string "My name is Bob" to the field `${param:INPUT_FIELD_NAME}` in `${param:COLLECTION_PATH}` will result in the following redacted output in `${param:OUTPUT_FIELD_NAME}`:

```js
{
  ${param:INPUT_FIELD_NAME}: 'My name is Bob',
  ${param:OUTPUT_FIELD_NAME}: 'My name is <PERSON>',
}
```

#### Input field as a map of input strings

Create or update a document in `${param:COLLECTION_PATH}` with the field `${param:INPUT_FIELD_NAME}` value like the following:

```js
{
  first: "My name is Bob",
  second: "My phone number is 415-555-5555",
}
```

will result in the following translated output in `${param:OUTPUT_FIELD_NAME}`:

```js
{
  ${param:INPUT_FIELD_NAME}: {
    first: "My name is Bob",
    second: "My phone number is 415-555-5555",
  },

  ${param:OUTPUT_FIELD_NAME}: {
    first: "My name is <PERSON>",
    second: "My phone number is <PHONE_NUMBER>",
  },
}
```

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.

[Redact Dashboard]: https://console.pangea.cloud/service/redact?utm_medium=marketplace&utm_source=firebase&utm_campaign=firebase-extension-redact
