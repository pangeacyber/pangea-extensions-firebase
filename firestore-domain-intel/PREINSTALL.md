Use this extension to lookup and detect suspicious domain names using the Pangea Domain Intel service by writing domain names to a Cloud Firestore collection.

This extension:

- Listens to your specified Cloud Firestore collection. If you add a string to a specified field in any document within that collection, this extension queries the value of the field using [Pangea Domain Intel Service](https://pangea.cloud/services/domain-intel/).  
- Optionally, listens to Firebase Authentication user creation events and looks up the new user's email domain using Pangea's Domain Intel service and stores the results in the Firestore collection which was specified during extension setup.

If the original input field of the document is updated, the new value will be also be queried using Pangea Domain Intel service and the document will be updated with the response.

#### Additional setup

Before installing this extension, make sure that you have signed up for a free [Pangea](https://pangea.cloud/signup?utm_medium=google-marketplace&utm_source=marketplace&utm_campaign=firestore-domain-intel) account and have [set up a Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) in your Firebase project.

#### Billing
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
  - Pangea Domain Intel
  - Cloud Firestore
  - Cloud Functions (Node.js 10+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))

Usage of this extension also requires you to have a [Pangea](https://pangea.cloud/signup?utm_medium=google-marketplace&utm_source=marketplace&utm_campaign=firestore-domain-intel) account. You are responsible for any associated costs with your usage of Pangea.
