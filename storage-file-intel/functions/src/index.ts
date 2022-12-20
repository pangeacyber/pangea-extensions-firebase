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

import * as admin from "firebase-admin";
import { getEventarc } from "firebase-admin/eventarc";
import * as fs from "fs";
import * as functions from "firebase-functions";
import * as mkdirp from "mkdirp";
import * as os from "os";
import * as path from "path";
import * as crypto from "crypto";

import config, { deleteImage } from "./config";
import * as logs from "./logs";
import { startsWithArray } from "./util";
import {
  IsolateFileResult,
  isolateFile,
} from "./isolate-file";

import { PangeaConfig, PangeaResponse, FileIntelService, PangeaErrors } from "pangea-node-sdk";

const pangeaConfig = new PangeaConfig({ domain: config.pangeaDomain });
const fileIntel = new FileIntelService(config.pangeaToken, pangeaConfig);

enum threatVerdict {
  unknown = "unknown",
  malicious = "malicious",
  trojan = "trojan",
}

// Initialize the Firebase Admin SDK
admin.initializeApp();

const eventChannel =
  process.env.EVENTARC_CHANNEL &&
  getEventarc().channel(process.env.EVENTARC_CHANNEL, {
    allowedEventTypes: process.env.EXT_SELECTED_EVENTS,
  });

logs.init();

/**
 * When an image is uploaded in the Storage bucket, we generate a resized image automatically using
 * the Sharp image converting library.
 */
export const checkFileReputation = functions.storage
  .object()
  .onFinalize(async (object): Promise<void> => {
    logs.start();
    const { contentType } = object; // This is the image MIME type

    const tmpFilePath = path.resolve("/", path.dirname(object.name)); // Absolute path to dirname

    if (
      config.includePathList &&
      !startsWithArray(config.includePathList, tmpFilePath)
    ) {
      logs.fileOutsideOfPaths(config.includePathList, tmpFilePath);
      return;
    }

    if (
      config.excludePathList &&
      startsWithArray(config.excludePathList, tmpFilePath)
    ) {
      logs.fileInsideOfExcludedPaths(config.excludePathList, tmpFilePath);
      return;
    }

    if (object.metadata && object.metadata.isolatedFile === "true") {
      logs.fileAlreadyIsolated();
      return;
    }

    const bucket = admin.storage().bucket(object.bucket);
    const filePath = object.name; // File path in the bucket.
    const parsedPath = path.parse(filePath);
    const objectMetadata = object;

    let originalFile;
    let remoteFile;
    try {
      originalFile = path.join(os.tmpdir(), filePath);
      const tempLocalDir = path.dirname(originalFile);

      // Create the temp directory where the storage file will be downloaded.
      logs.tempDirectoryCreating(tempLocalDir);
      await mkdirp(tempLocalDir);
      logs.tempDirectoryCreated(tempLocalDir);

      // Download file from bucket.
      remoteFile = bucket.file(filePath);
      logs.fileDownloading(filePath);
      await remoteFile.download({ destination: originalFile });
      logs.fileDownloaded(filePath, originalFile);

      //const tasks: Promise<PangeaResponse<Response>>[] = [];
      const tasks: Promise<IsolateFileResult>[] = [];

      const fileBuffer = fs.readFileSync(originalFile);
      const hashSum = crypto.createHash('sha256');
      hashSum.update(fileBuffer);
      const fileHash = hashSum.digest('hex');

      const options = { provider: "reversinglabs", verbose: true, raw: true };
      try {
        const response = await fileIntel.lookup(
          fileHash,
          "sha256",
          options
        );
        console.log(response.result);

        if(response.success) {
          logs.threatVerdict(response.result.data.verdict);

          if(response.result.data.verdict !== threatVerdict.unknown)
            return;

          tasks.push(
            isolateFile({
              bucket,
              originalFile,
              parsedPath,
              objectMetadata: objectMetadata,
            }));
        }

      } catch (e) {
        if (e instanceof PangeaErrors.APIError) {
          console.log("Error", e.summary, e.errors);
        } else {
          console.log("Error: ", e);
        }
      }

      const results = await Promise.all(tasks);
      eventChannel &&
        (await eventChannel.publish({
          type: "firebase.extensions.pangea-file-intel.v1.complete",
          subject: filePath,
          data: {
            input: object,
            outputs: results,
          },
        }));

      const failed = results.some((result) => result.success === false);
      if (failed) {
        logs.failed();
        return;
      } else {
        if (config.deleteOriginalFile === deleteImage.onSuccess) {
          if (remoteFile) {
            try {
              logs.remoteFileDeleting(filePath);
              await remoteFile.delete();
              logs.remoteFileDeleted(filePath);
            } catch (err) {
              logs.errorDeleting(err);
            }
          }
        }
        logs.complete();
      }
    } catch (err) {
      logs.error(err);
    } finally {
      if (originalFile) {
        logs.tempOriginalFileDeleting(filePath);
        fs.unlinkSync(originalFile);
        logs.tempOriginalFileDeleted(filePath);
      }
      if (config.deleteOriginalFile === deleteImage.always) {
        // Delete the original file
        if (remoteFile) {
          try {
            logs.remoteFileDeleting(filePath);
            await remoteFile.delete();
            logs.remoteFileDeleted(filePath);
          } catch (err) {
            logs.errorDeleting(err);
          }
        }
      }
    }
  });
