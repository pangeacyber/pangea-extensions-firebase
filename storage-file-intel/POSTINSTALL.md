### See it in action

You can test out this extension right away!

1.  Go to your [Storage dashboard](https://console.firebase.google.com/project/${param:PROJECT_ID}/storage) in the Firebase console.

2.  Upload a file to the bucket: `${param:IMG_BUCKET}`

3.  In a few seconds, if the file is deemed malicious a zip file will appear in the same bucket at `${param:ISOLATION_PATH}`.

    Note that you might need to refresh the page to see changes.

### Using the extension

You can upload files using the [Cloud Storage for Firebase SDK](https://firebase.google.com/docs/storage/) for your platform (iOS, Android, or Web). Alternatively, you can upload images directly in the Firebase console's Storage dashboard.

Whenever you upload a known malicious file to `${param:IMG_BUCKET}`, this extension does the following:

- Creates neutralized gzip file containing a copy of the malicious file.
- Names the gzip file using the same name as the original uploaded file, but suffixed with the original file's extension.
- Stores the gzip file in the bucket `${param:IMG_BUCKET}` (and, if configured, under the path `${param:ISOLATION_PATH}`).

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.
