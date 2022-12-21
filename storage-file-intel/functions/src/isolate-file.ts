/*
 * Pangea Cyber 2022 Pange Cyber Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import config from "./config";
import * as logs from "./logs";

import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import * as Archiver from 'archiver';
import * as ArchiverEncrypted from 'archiver-zip-encrypted';
if(config.zipPassword !== undefined)
  Archiver.registerFormat('zip-encrypted', ArchiverEncrypted);

import { Bucket } from "@google-cloud/storage";
import { ObjectMetadata } from "firebase-functions/lib/providers/storage";
import { uuid } from "uuidv4";

export interface IsolateFileResult {
  outputFilePath: string;
  success: boolean;
}

export const isolateFile = async ({
  bucket,
  originalFile,
  parsedPath,
  objectMetadata,
}: {
  bucket: Bucket;
  originalFile: string;
  parsedPath: path.ParsedPath;
  objectMetadata: ObjectMetadata;
}): Promise<IsolateFileResult> => {
  const {
    ext: fileExtension,
    dir: fileDir,
    name: fileNameWithoutExtension,
  } = parsedPath;

  console.log("zipPassword = " + config.zipPassword);

  logs.isolatingFile(originalFile);

  let modifiedFileName = `${fileNameWithoutExtension}_${fileExtension.slice(1)}.zip`;

  // Path where the zip file will be uploaded to in Storage.
  const modifiedFilePath = path.normalize(
    config.ioslationPath
      ? path.join(fileDir, config.ioslationPath, modifiedFileName)
      : path.join(fileDir, modifiedFileName)
  );
  let modifiedFile: string;

  try {
    modifiedFile = path.join(os.tmpdir(), modifiedFileName);

    // filename\*=utf-8''  selects any string match the filename notation.
    // [^;\s]+ searches any following string until either a space or semi-colon.
    const contentDisposition =
      objectMetadata && objectMetadata.contentDisposition
        ? objectMetadata.contentDisposition.replace(
            /(filename\*=utf-8''[^;\s]+)/,
            `filename*=utf-8''${modifiedFileName}`
          )
        : "";

    // Cloud Storage files.
    const metadata: { [key: string]: any } = {
      contentDisposition,
      contentEncoding: objectMetadata.contentEncoding,
      contentLanguage: objectMetadata.contentLanguage,
      contentType: "application/zip",
      metadata: objectMetadata.metadata ? { ...objectMetadata.metadata } : {},
    };
    metadata.metadata.isolatedFile = true;

    // If the original image has a download token, add a
    // new token to the file being isolated.
    if (metadata.metadata.firebaseStorageDownloadTokens) {
      metadata.metadata.firebaseStorageDownloadTokens = uuid();
    }

    const createZip = new Promise((resolve, reject) => {
      // create a file to stream archive data to.
      const output = fs.createWriteStream(modifiedFile);

      let archive;
      if (config.zipPassword === undefined) {
        archive = Archiver('zip', {
          zlib: { level: 8 }
        });
      } else {
        // create archive and specify method of encryption and password
        archive = Archiver.create('zip-encrypted', {
          zlib: { level: 8 },
          encryptionMethod: 'aes256',
          password: config.zipPassword
        });
      }

      // listen for all archive data to be written
      output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
        resolve();
      });

      // pipe archive data to the file
      archive.pipe(output);
      // append a file
      archive.file(originalFile, { name: fileNameWithoutExtension +  fileExtension});
      // finalize the archive ('close', 'end' or 'finish' may be fired right after calling this method)
      archive.finalize();
    });

    // synchronously call create the zip file
    await createZip();

    if (fs.existsSync(modifiedFile)) {
      logs.createdFile(modifiedFile);
    }

    // Uploading the zip file back to the bucket.
    logs.fileUploading(modifiedFilePath);
    const uploadResponse = await bucket.upload(modifiedFile, {
      destination: modifiedFilePath,
      metadata,
    });
    logs.fileUploaded(modifiedFile);

    return { outputFilePath: modifiedFilePath, success: true };
  } catch (err) {
    logs.error(err);
    return { outputFilePath: modifiedFilePath, success: false };
  } finally {
    try {
      // Make sure the local zip file is cleaned up to free up disk space.
      if (modifiedFile) {
        logs.tempFileDeleting(modifiedFilePath);
        fs.unlinkSync(modifiedFile);
        logs.tempFileDeleted(modifiedFilePath);
      }
    } catch (err) {
      logs.errorDeleting(err);
    }
  }
};
