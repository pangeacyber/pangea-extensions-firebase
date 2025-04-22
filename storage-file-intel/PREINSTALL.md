Use this extension to automatically check files uploaded to a Cloud Storage bucket for malicious behavior. It will compare the hash of the file to against a list of 25 million known malicious files.

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
