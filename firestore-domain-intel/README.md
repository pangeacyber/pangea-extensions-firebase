# Pangea Domain Intel

**Author**: Pangea Cyber (**[https://pangea.cloud](https://pangea.cloud)**)

**Description**: Scans specified urls using Pangea Domain Intel service and writes the results to the specified Firestore field, and optionally publishes the events to Pangea Audit Log if enabled.



**Details**: Use this extension to lookup and detect suspicious domain names using the Pangea Domain Intel service by writing domain names to a Cloud Firestore collection.

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




**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Pangea service base domain: The base domain of where your Pangea Service is deployed. The **Domain** value can be copied from the main dashboard of the [Pangea Console](https://console.pangea.cloud).


* Pangea Auth Token with access to the Domain Intel service: The Pangea Token to use to authenticate access to the Domain Intel service. The **Token** value can be copied from the [Domain Intel Dashboard](https://console.pangea.cloud/service/domain-intel) of the Pangea Console.


* Pangea service provider: The service provider for the Pangea Domain Intel service. Please pick either `domaintools` or `crowdstrike`


* Collection path: What is the path to the collection that contains the domain url to be scanned?


* Input field name: What is the name of the field that contains the domain url?


* Response output field name: What is the name of the field where you want to store response from the Pangea Domain Intel service?




**Cloud Functions:**

* **pangea_firestore_domain_intel:** Listens for writes of new strings to your specified Cloud Firestore collection, scans the spefied value using Pangea Domain Intel service

* **onusercreated:** Detects and automatically records a Secure Audit Log entry when a new user is created.

* **onuserdeleted:** Detects and automatically records a Secure Audit Log entry when a user is deleted.



**APIs Used**:

* eventarc.googleapis.com (Reason: Powers all events and triggers)

* run.googleapis.com (Reason: Powers v2 functions)



**Access Required**:



This extension will operate with the following project IAM roles:

* datastore.user (Reason: Allows the extension to read/write to Cloud Firestore.)
