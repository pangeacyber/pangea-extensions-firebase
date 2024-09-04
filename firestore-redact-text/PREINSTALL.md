Use this extension to redact sensitive text from strings (based on defined rulesets) written to a Cloud Firestore collection.

This extension listens to your specified Cloud Firestore collection. If you add a string to a specified field in any document within that collection, this extension:

- Redacts text from the string based on the rulesets configured in the Pangea Console [Redact Dashboard][]; Redacted text is also replaced with predefined tags.
- Adds the Redacted version(s) of the string to a separate specified field in the same document.

You specify the desired data types to redact such as names, email addresses, phone numbers, social security numbers, crypto keys, medical licenses, or customized your own types. You can find a list of predefined rulesets on the Pangea Console [Redact Dashboard][].

If the original non-redacted field of the document is updated, then the redactions will be automatically updated, as well.

#### Multiple collections for redactions

To redact multiple collections, install this extension multiple times, specifying a different
collection path each time. There is currently no limit on how many instances of an extension you
can install.

#### Multiple field redactions

To redact multiple fields, store a map of input strings in the input field:

```js
admin.firestore().collection("redact").add({
  first: "My name is Bob",
  second: "My phone number is 415-555-5555",
});
```

#### Additional setup

Before installing this extension, make sure that you have signed up for a free [Pangea](https://pangea.cloud/signup?utm_medium=marketplace&utm_source=firebase&utm_campaign=firebase-extension-redact) account and have [set up a Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) in your Firebase project.

#### Billing

To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
  - Pangea Redact API
  - Cloud Firestore
  - Cloud Functions (Node.js 18+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))

Usage of this extension also requires you to have a [Pangea](https://pangea.cloud/signup?utm_medium=marketplace&utm_source=firebase&utm_campaign=firebase-extension-redact) account. You are responsible for any associated costs with your usage of Pangea.

[Redact Dashboard]: https://console.pangea.cloud/service/redact?utm_medium=marketplace&utm_source=firebase&utm_campaign=firebase-extension-redact
