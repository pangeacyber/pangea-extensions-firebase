# Pangea IP Intel

**Author**: Pangea Cyber (**[https://pangea.cloud](https://pangea.cloud)**)

**Description**: Scans specified urls using Pangea IP Intel service and writes the results to the specified Firestore field, and optionally publishes the events to Pangea Audit Log if enabled.



**Details**: Use this extension to lookup and detect suspicious IP addresses using the Pangea IP Intel service by writing IP addresses to a Cloud Firestore collection.

This extension:

- Listens to your specified Cloud Firestore collection. If you add a string to a specified field in any document within that collection, this extension queries the value of the field using [Pangea IP Intel Service](https://pangea.cloud/services/ip-intel/).  

If the original input field of the document is updated, the new value will be also be queried using Pangea IP Intel service and the document will be updated with the response.

#### Additional setup

Before installing this extension, make sure that you have signed up for a free [Pangea](https://pangea.cloud/signup?utm_medium=google-marketplace&utm_source=marketplace&utm_campaign=firestore-ip-intel) account and have [set up a Cloud Firestore database](https://firebase.google.com/docs/firestore/quickstart) in your Firebase project.

#### Billing
To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
  - Pangea IP Intel
  - Cloud Firestore
  - Cloud Functions (Node.js 10+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))

Usage of this extension also requires you to have a [Pangea](https://pangea.cloud/signup?utm_medium=google-marketplace&utm_source=marketplace&utm_campaign=firestore-ip-intel) account. You are responsible for any associated costs with your usage of Pangea.




**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Pangea service base domain: The base domain of where your Pangea Service is deployed. The **Domain** value can be copied from the main dashboard of the [Pangea Console](https://console.pangea.cloud).


* Pangea Auth Token with access to the IP Intel service: The Pangea Token to use to authenticate access to the IP Intel service. The **Token** value can be copied from the [IP Intel Dashboard](https://console.pangea.cloud/service/ip-intel) of the Pangea Console.


* Pangea service provider: The service provider for the Pangea IP Intel service. Currently there is only `crowdstrike` available.


* Collection path: What is the path to the collection that contains the IP address to be scanned?


* Input field name: What is the name of the field that contains the IP address?


* Response output field name: What is the name of the field where you want to store response from the Pangea IP Intel service?




**Cloud Functions:**

* **pangea_firestore_ip_intel:** Listens for writes of new strings to your specified Cloud Firestore collection, scans the spefied value using Pangea IP Intel service

* **onusercreated:** Detects and automatically records a Secure Audit Log entry when a new user is created.

* **onuserdeleted:** Detects and automatically records a Secure Audit Log entry when a user is deleted.



**APIs Used**:

* eventarc.googleapis.com (Reason: Powers all events and triggers)

* run.googleapis.com (Reason: Powers v2 functions)



**Access Required**:



This extension will operate with the following project IAM roles:

* datastore.user (Reason: Allows the extension to read/write to Cloud Firestore.)
