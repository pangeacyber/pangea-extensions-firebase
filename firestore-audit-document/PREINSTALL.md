Use this extension to log changes to a Firestore collection. The extension is useful to monitor collections that contain compliance-critical data. To audit multiple collections, the extension can be installed multiple times with corresponding collection names.

This extension:

- Listens to Firestore events for the specified collection. Every create/update/delete requests to the collection will be logged to Pangea's [Secure Audit Log][] service.

#### Additional setup

Before installing this extension, make sure that you have signed up for a free [Pangea](https://pangea.cloud/signup?utm_medium=marketplace&utm_source=firebase&utm_campaign=firestore-sensitive-document-audit) account and have [set up a Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) in your Firebase project.

#### Billing

To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
  - Pangea Secure Audit Service
  - Cloud Firestore
  - Cloud Functions (Node.js 20+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))

Usage of this extension also requires you to have a [Pangea](https://pangea.cloud/signup?utm_medium=marketplace&utm_source=firebase&utm_campaign=firestore-sensitive-document-audit) account. You are responsible for any associated costs with your usage of Pangea.

[Secure Audit Log]: https://pangea.cloud/services/audit-log?utm_medium=marketplace&utm_source=firebase&utm_campaign=firestore-sensitive-document-audit
