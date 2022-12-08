# Translate Text

**Author**: Pangea Cyber (**[https://pangea.cloud](https://pangea.cloud)**)

**Description**: Redact sensitive text from strings written to a Cloud Firestore collection (uses the Pangea Redact API).



**Details**: Use this extension to redact sensitive text from strings (based on defined rules) written to a Cloud Firestore collection.

This extension listens to your specified Cloud Firestore collection. If you add a string to a specified field in any document within that collection, this extension:

- Redacts text from the string based on the rulesets configured in the Pangea Console [Redact Dashboard](https://console.pangea.cloud/service/redact); Redacted text is also replaced with predefined tags.  
- Adds the Redacted version(s) of the string to a separate specified field in the same document.

You specify the desired data types to redact such as names, email addresses, phone numbers, social security numbers, crypto keys, medical licenses, or customized your own types. You can find a list of predefined rulesets on the Pangea Console [Redact Dashboard](https://console.pangea.cloud/service/redact).

If the original non-redacted field of the document is updated, then the redactions will be automatically updated, as well.

#### Multiple collections for redactions

To redact multiple collections, install this extension multiple times, specifying a different
collection path each time. There is currently no limit on how many instances of an extension you
can install.

#### Multiple field redactions

To redact multiple fields, store a map of input strings in the input field:

```js
admin.firestore().collection('redact').add({
  first: "My name is Bob",
  second: "My phone number is 415-555-5555"
})
```

#### Additional setup

Before installing this extension, make sure that you have signed up for a free [Pangea](https://pangea.cloud/signup?utm_medium=google-marketplace&utm_source=marketplace&utm_campaign=firebase-extension-audit) account and have [set up a Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) in your Firebase project.

#### Billing
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
  - Pangea Redact API
  - Cloud Firestore
  - Cloud Functions (Node.js 10+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))





**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).


* Collection path: What is the path to the collection that contains the strings that you want to redact?


* Input field name: What is the name of the field that contains the string that you want to redact?


* Redaction output field name: What is the name of the field where you want to store your redacted text?


* Pangea service domain: Where is your Pangea Service is deployed?


* Pangea Auth Token: A Pangea Auth Token with access to the Secure Audit Log service.




**Cloud Functions:**

* **fslog:** Listens for writes of new strings to your specified Cloud Firestore collection, redact sensitive text from the strings based on defined rulesets, then writes the translated strings back to the same document.



**APIs Used**:

* redact.aws.us.pangea.cloud/v1/redact (Reason: To use the Pangea Redact Service to redact text from strings.)



**Access Required**:



This extension will operate with the following project IAM roles:

* datastore.user (Reason: Allows the extension to write redacted strings to Cloud Firestore.)
