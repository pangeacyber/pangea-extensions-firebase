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

import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import * as AdmZip from 'adm-zip';

import { Bucket } from "@google-cloud/storage";
import { ObjectMetadata } from "firebase-functions/lib/providers/storage";
import { uuid } from "uuidv4";

import config from "./config";
import * as logs from "./logs";

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

    // zip file
    var zip = new AdmZip();

    // add the malious file to the zip file to isolated it
    zip.addLocalFile(originalFile);

    // TODO: Add metadata, event info, or context to a txt file (timestamp, response data, user, etc)
    //var content = "inner content of the file";
    //zip.addFile("test.txt", Buffer.from(content, "utf8"), "entry comment goes here");

    // Write zip file to disk
    zip.writeZip(modifiedFile);

    logs.createdFile(modifiedFile);

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
        logs.tempResizedFileDeleting(modifiedFilePath);
        fs.unlinkSync(modifiedFile);
        logs.tempResizedFileDeleted(modifiedFilePath);
      }
    } catch (err) {
      logs.errorDeleting(err);
    }
  }
};
