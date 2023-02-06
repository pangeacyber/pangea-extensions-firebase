# Pangea Domain Intel Lookup

**Author**: Pangea Cyber (**[https://pangea.cloud](https://pangea.cloud)**)

**Description**: Scans domains names using industry leading threat intelligence from top security research organizations. 

**Details**: Use this extension to scan domain names using Pangea Domain Intel service. Access up-to-date domain intelligence, so you always know if you're dealing with a suspicious domain.

This extension:

- Listens to your specified Cloud Firestore collection. If you add a string to a specified field in any document within that collection, this extension scans the new value of the field using [Pangea Domain Intel Service](https://pangea.cloud/services/domain-intel/).  
- Listens to Firebase Authentication user creation events and scans the new user's email domain using Pangea's Domain Intel service and stores the results in the Firestore collection which was specified during extension setup.

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


* Pangea Auth Token with access to the Pangea Domain Intel service: The Pangea Token to use to authenticate access to the Pangea Domain Intel service


* Domain Intel Provider: A provider must be selected from the following list: DomainTools, Crowdstrike


* Collection path: What is the path to the collection that contains the domain name string that you want to scan?


* Input field name: What is the name of the field that contains the domain name string that you want to scan?


* Response output field name: What is the name of the field where you want to store response from the Pangea service?


**Cloud Functions:**

* **pangea_firestore_domain_intel:** Listens for writes of new strings to your specified Cloud Firestore collection, scans them using the Domain Intel service and stores the scan results in the same document under a different field


**Other Resources**:

* onusercreated
* onuserdeleted


**Access Required**:


This extension will operate with the following project IAM roles:

* datastore.user (Reason: Allows the extension to write Secure Audit Log response to Cloud Firestore.)
