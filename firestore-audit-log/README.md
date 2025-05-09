# Secure Audit Logging

**Author**: Pangea Cyber (**[https://pangea.cloud](https://pangea.cloud)**)

**Description**: Record security critical app events using Pangea Secure Audit Log service by writing to a specified Cloud Firestore collection (uses the Pangea Secure Audit Log API).



**Details**: Use this extension to securely log sensitive events using Pangea tamperproof Secure Audit Log service by writing log messages to a Cloud Firestore collection or by emitting an EventArc event.

This extension listens to your specified Cloud Firestore collection. If you add a string or event object map to a specified field in any document within that collection, this extension:

- Securely Logs the string or event using the Pangea Secure Audit Log service. Logs can later be viewed using the Pangea Dashboard [Secure Audit Log Viewer][].
- Hashes of each log entry will be recorded on a tamperproof blockchain and can be cryptographically verified for authenticity.

You can specify the desired metadata types in addition to the message for each log entry, such as, actor, action, source, target, and status. For more information on the Pangea Secure Audit Log service reference the [Documentation][].

If the original input field of the document is updated, a new log entry will be automatically created.

#### Logging messages (Firestore)

Each log is comprised of a set of fields designed to record specific components of the activity being recorded. The only required field is message, with all others being optional.

```js
getFirestore().collection("audit").add({
  log: "Record created",
});
```

#### Logging messages with optional metadata (Firestore)

To create an entry with optional metadata fields, store a map containing the optional fields as keys and values as strings.

```js
getFirestore()
  .collection("audit")
  .add({
    log: {
      message: "Record created with metadata",
      actor: "User 1",
      action: "Create",
      source: "Firebase client",
      target: "Database",
      status: "Completed",
    },
  });
```

#### Multiple log entries (Firestore)

To log multiple entries, store an array of either maps or strings:

```js
getFirestore()
  .collection("audit")
  .add({
    log: [
      {
        message: "First record created",
        actor: "User 1",
        action: "Create",
        source: "Firebase client",
        target: "Database",
        status: "Completed",
      },
      {
        message: "Second record created",
        actor: "User 1",
        action: "Create",
        source: "Firebase client",
        target: "Database",
        status: "Completed",
      },
      {
        message: "Third record created",
        actor: "User 1",
        action: "Create",
        source: "Firebase client",
        target: "Database",
        status: "Completed",
      },
    ],
  });
```

#### Logging messages (EventArc)

```js
getEventarc().channel().publish({
  type: "firebase.extensions.pangea-audit-log.v1.log",
  data: {
    message: "Record created with metadata",
    actor:  "User 1",
    action: "Create",
    source: "Firebase client",
    target: "Database",
    status: "Completed",
  }},
});
```

#### Additional setup

Before installing this extension, make sure that you have signed up for a free [Pangea](https://pangea.cloud/signup?utm_medium=marketplace&utm_source=firebase&utm_campaign=firebase-extension-audit) account and have [set up a Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) in your Firebase project.

> **NOTE**: If this extensions fails to install, try installing any other extension that emits an event first, for example the [Known Malware Detection](https://console.firebase.google.com/project/_/extensions/install?ref=pangea/storage-file-intel). Make sure to enable the event for that extension. This will ensure that the proper event channels are configured in your Firebase application. Then, reinstall this extension. You can uninstall the extension that created the channel and all subsequent installs will continue to work.

#### Billing

To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
  - Pangea Redact API
  - Cloud Firestore
  - Cloud Functions (Node.js 20+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))

Usage of this extension also requires you to have a [Pangea](https://pangea.cloud/signup?utm_medium=marketplace&utm_source=firebase&utm_campaign=firebase-extension-audit) account. You are responsible for any associated costs with your usage of Pangea.

[Secure Audit Log Viewer]: https://console.pangea.cloud/service/audit/logs?utm_medium=marketplace&utm_source=firebase&utm_campaign=firebase-extension-audit
[Documentation]: https://pangea.cloud/docs/audit?utm_medium=marketplace&utm_source=firebase&utm_campaign=firebase-extension-audit




**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Pangea service base domain: The base domain of where your Pangea Service is deployed. The **Domain** value can be copied from the main dashboard of the [Pangea Console](https://console.pangea.cloud?utm_medium=marketplace&utm_source=firebase&utm_campaign=firebase-extension-audit).


* Pangea Auth Token with access to the Secure Audit Log service: The Pangea Token to use to authenticate access to the Pangea Secure Audit Log service. The **Token** value can be copied from the [Secure Audit Log Dashboard](https://console.pangea.cloud/service/audit?utm_medium=marketplace&utm_source=firebase&utm_campaign=firebase-extension-audit) of the Pangea Console.


* Collection path: What is the path to the collection that contains the strings that you want to log?


* Input field name: What is the name of the field that contains the messages that you want to log?


* Response output field name: What is the name of the field where you want to store response from the Secure Audit Log service?




**Cloud Functions:**

* **fslog:** Listens for writes of new strings to your specified Cloud Firestore collection, records them using the Secure Audit Log service, a hash of each log entry will be recorded on a immutable and tamperproof blockchain which can later be cryptographically verified for authenticity

* **onusercreated:** Detects and automatically records a Secure Audit Log entry when a new user is created.

* **onuserdeleted:** Detects and automatically records a Secure Audit Log entry when a user is deleted.



**Other Resources**:

* onmaliciousfiledetected (firebaseextensions.v1beta.v2function)

* onlogevent (firebaseextensions.v1beta.v2function)



**APIs Used**:

* eventarc.googleapis.com (Reason: Powers all events and triggers)

* run.googleapis.com (Reason: Powers v2 functions)



**Access Required**:



This extension will operate with the following project IAM roles:

* datastore.user (Reason: Allows the extension to write Secure Audit Log response to Cloud Firestore.)
