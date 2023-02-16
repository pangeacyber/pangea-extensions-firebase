# Pangea Sensitive Document Audit

**Author**: Pangea Cyber (**[https://pangea.cloud](https://pangea.cloud)**)

**Description**: Monitors documents on a Firestore collection and logs the changes using Pangea's Secure Audit Log service.

**Details**: Use this extension to log changes to a Firestore collection. The extension is mostly useful for collections that contain sensitive data. In order to audit multiple collections, the extension needs to be installed multiple times with corresponding collection names.

This extension:

- Listens to Firestore events for the specified collection. Every create/update/delete operation to the collection will be logged to Pangea's Secure Audit Log service. [Pangea Secure Audit Service](https://pangea.cloud/services/audit-log/).  

#### Additional setup

Before installing this extension, make sure that you have signed up for a free [Pangea](https://pangea.cloud/signup?utm_medium=google-marketplace&utm_source=marketplace&utm_campaign=firestore-sensitive-document-audit) account and have [set up a Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) in your Firebase project.

#### Billing
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
  - Pangea Secure Audit Service
  - Cloud Firestore
  - Cloud Functions (Node.js 10+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))

Usage of this extension also requires you to have a [Pangea](https://pangea.cloud/signup?utm_medium=google-marketplace&utm_source=marketplace&utm_campaign=firestore-sensitive-document-audit) account. You are responsible for any associated costs with your usage of Pangea.

**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Pangea service base domain: The base domain of where your Pangea Service is deployed. The **Domain** value can be copied from the main dashboard of the [Pangea Console](https://console.pangea.cloud).

* Pangea Service Token with access to the Audit Log service: The Pangea Token to use to authenticate access to the Audit Log service. The **Token** value can be copied from the [Audit Log Dashboard](https://console.pangea.cloud/service/ip-intel) of the Pangea Console.

* Collection path: What is the path to the collection that will be audited?

* Fields to audit: Enter the fields that needs auditing. Please use comma to between the field names. If all the fields need to be audited then leave this parameter empty.

**Cloud Functions:**

* **firestore_sensitive_document_audit:** Listens for writes of new strings to your specified Cloud Firestore collection, scans the spefied value using Pangea Audit Log service


**APIs Used**:

* eventarc.googleapis.com (Reason: Powers all events and triggers)

* run.googleapis.com (Reason: Powers v2 functions)


**Access Required**:

This extension will operate with the following project IAM roles:

* datastore.user (Reason: Allows the extension to read/write to Cloud Firestore.)
