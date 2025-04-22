# Known Malware Detection

**Author**: Pangea Cyber (**[https://pangea.cloud](https://pangea.cloud)**)

**Description**: Checks files uploaded to Cloud Storage for known malicious behavior, isolates the file in a gzip formatted container if deemed malicious, and optionally keeps or deletes the original file.



**Details**: Use this extension to automatically check files uploaded to a Cloud Storage bucket for malicious behavior. It will compare the hash of the file to against a list of 25 million known malicious files.

When a user uploads a file to your specified Cloud Storage bucket, this extension:

- Detects if the file is a known malicious file. If it is, then:
  - Neutralizes the file by copying the file to a gzip formatted container.
  - Optionally, deletes the original file.

The extension can publish a completion event when a file is neutralized, which can be optionally enabled when you install it. If you enable events, you can [write custom event handlers](https://firebase.google.com/docs/extensions/install-extensions#eventarc) that respond to these events. You can always enable or disable events later. Events will be emitted via Eventarc.

#### Detailed configuration information

To configure this extension, you specify a Cloud Storage bucket to monitor and an absolute path within that bucket to copy the neutralized malicious files that are uploaded to it.

For example, say that you specify to monitor the bucket '_my-project.appspot.com_' and an isolation path of '_/malicious_'. If a user uploads a file '_virus.exe_' to any sub-path in the '_my-project.appspot.com_' and the file's hash matches that of a known malicious file, a gzip formatted file containing the file will be created at the path '_/malicious/virus_exe.zip_'

#### Additional setup

Before installing this extension, make sure that you have signed up for a free [Pangea](https://pangea.cloud/signup?utm_medium=marketplace&utm_source=firebase&utm_campaign=firebase-extension-file-intel) account and have [set up a Cloud Storage bucket](https://firebase.google.com/docs/storage) in your Firebase project.

> **NOTE**: As mentioned above, this extension listens for all changes made to the specified Cloud Storage bucket. This may cause unnecessary function calls. It is recommended to create a separate Cloud Storage bucket, especially for images you want to resize, and set up this extension to listen to that bucket.

#### Multiple instances of this extension

You can install multiple instances of this extension for the same project to configure. However, as mentioned before this extension listens for all changes made to the specified Cloud Storage bucket. That means all instances will be triggered every time a file is uploaded to the bucket. Therefore, it is recommended to use different buckets instead of different paths to prevent unnecessary function calls.

#### Troubleshooting

If events are enabled, and you want to create custom event handlers to respond to the events published by the extension, you must ensure that you have the appropriate [role/permissions](https://cloud.google.com/pubsub/docs/access-control#permissions_and_roles) to subscribe to Pub/Sub events.

#### Billing

To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
- Cloud Storage
- Cloud Functions (Node.js 20+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))
- If you enable events [Eventarc fees apply](https://cloud.google.com/eventarc/pricing).

Usage of this extension also requires you to have a [Pangea](https://pangea.cloud/signup?utm_medium=marketplace&utm_source=firebase&utm_campaign=firebase-extension-file-intel) account. You are responsible for any associated costs with your usage of Pangea.




**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your Storage bucket. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Pangea service base domain: The base domain of where your Pangea Service is deployed. The **Domain** value can be copied from the main dashboard of the [Pangea Console](https://console.pangea.cloud?utm_medium=marketplace&utm_source=firebase&utm_campaign=firebase-extension-file-intel).


* A Pangea Auth Token with access to the File Intel service: Used to authenticate access to Pangea services.


* Cloud Storage bucket to secure: To which Cloud Storage bucket will you upload files that you want to monitor for malicious behavior? Files deemed malicious are copied into in a gzip formatted container and the original is then either kept or deleted, depending on your extension configuration. Isolated files will also be stored in this bucket. It is recommended to create a separate bucket for this extension. For more information, refer to the [pre-installation guide](https://firebase.google.com/products/extensions/pangea-file-intel).


* Absolute path to move the zipped malicious files: An absolute path in which to store the gzip container used to neutralize the malicious file that was uploaded. For example, if you specify a path here of `/malicious` and a file is uploaded to `/documents/virus.exe`, then the zip file is stored at `/malicious/virus_exe.zip`. If you prefer to store isolated files at the root of your bucket, leave this field empty.


* A password to protect the gzip container: A password to protect the gzip container used to neutralize the malicious file that was uploaded. The password will be required to extract the gzip container and analyze the malicious file. If you prefer not to password protect your gzip file, leave this field empty.


* Deletion of original file: Do you want to automatically delete the original file from the Cloud Storage bucket if it deemed malicious? Note that these deletions cannot be undone.

* Paths that contain files you want to monitor for malicious behavior: Restrict this extension to only check files in specific locations in your Storage bucket by supplying a comma-separated list of absolute paths. For example, to only check files stored in the `/users/uploads` and `/user/inbox` directories, specify the paths `/users/uploads,/user/inbox`.
You may also use wildcard notation for directories in the path. For example, `/users/*/uploads` would match `/users/user1/uploads/image.png` as well as `/users/user2/uploads/any/sub/directory/image.png`.
If you prefer to monitor every file uploaded to your Storage bucket, leave this field empty.


* List of absolute paths not to monitor for malicious behavior: Ensure this extension does *not* check files in _specific locations_ in your Storage bucket by supplying a comma-separated list of absolute paths. For example, to *exclude* the files stored in the `/users/sandbox` and `/general/items` directories, specify the paths `/users/sandbox,/general/items`.
You may also use wildcard notation for directories in the path. For example, `/users/*/pictures` would exclude `/users/user1/pictures/image.png` as well as `/users/user2/pictures/any/sub/directory/image.png`.
If you prefer to monitor every file uploaded to your Storage bucket, leave this field empty.


* Cloud Function memory: Memory of the function responsible of zipping files. Choose how much memory to give to the function that zips files. (For large files we recommend using a minimum of 2GB).

* SMS Notification Phone Number: An E.164 formatted phone number to send SMS notifications to when a file is deemed malicious. This requires that the Twilio Send Message Extension is installed and that this the 'firebase.extensions.twilio.send.sms' event is enabled below.




**Cloud Functions:**

* **checkFileReputation:** Listens for new files uploaded to your specified Cloud Storage bucket, checks the file's reputation against a database of 25 millions known malicious files, and isolates the file in gzip formatted container if it is deemed malicious. Optionally keeps or deletes the original file.



**APIs Used**:

* storage-component.googleapis.com (Reason: Needed to use Cloud Storage)



**Access Required**:



This extension will operate with the following project IAM roles:

* storage.admin (Reason: Allows the extension to store neutralized files in Cloud Storage)
