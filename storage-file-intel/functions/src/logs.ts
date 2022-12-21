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

import { logger } from "firebase-functions";
import config from "./config";

export const complete = () => {
  logger.log("Completed execution of extension");
};

export const error = (err: Error) => {
  logger.error("Error when attempting to isolating file", err);
};

export const errorDeleting = (err: Error) => {
  logger.warn("Error when deleting files", err);
};

export const failed = () => {
  logger.error("Failed execution of extension");
};

export const fileAlreadyIsolated = () => {
  logger.log("File is already an isolated file, no processing is required");
};

export const fileOutsideOfPaths = (
  absolutePaths: string[],
  filePath: string
) => {
  logger.log(
    `File path '${filePath}' is not supported, these are the supported absolute paths: ${absolutePaths.join(
      ", "
    )}`
  );
};

export const fileInsideOfExcludedPaths = (
  absolutePaths: string[],
  filePath: string
) => {
  logger.log(
    `File path '${filePath}' is not supported, these are the not supported absolute paths: ${absolutePaths.join(
      ", "
    )}`
  );
};

export const fileDownloaded = (remotePath: string, localPath: string) => {
  logger.log(`Downloaded file: '${remotePath}' to '${localPath}'`);
};

export const fileDownloading = (path: string) => {
  logger.log(`Downloading file: '${path}'`);
};

export const fileUploaded = (path: string) => {
  logger.log(`Uploaded isolated file to '${path}'`);
};

export const fileUploading = (path: string) => {
  logger.log(`Uploading isolated file to '${path}'`);
};

export const init = () => {
  logger.log("Initializing extension with configuration", config);
};

export const start = () => {
  logger.log("Started execution of extension with configuration", config);
};

export const isolatingFile = (filePath: string) => {
  logger.log(`Isolating file '${filePath}'`);
};

export const createdFile = (filePath: string) => {
  logger.log(`Created '${filePath}' successfully`);
};

export const tempDirectoryCreated = (directory: string) => {
  logger.log(`Created temporary directory: '${directory}'`);
};

export const tempDirectoryCreating = (directory: string) => {
  logger.log(`Creating temporary directory: '${directory}'`);
};

export const tempOriginalFileDeleted = (path: string) => {
  logger.log(`Deleted temporary original file: '${path}'`);
};

export const tempOriginalFileDeleting = (path: string) => {
  logger.log(`Deleting temporary original file: '${path}'`);
};

export const tempFileDeleted = (path: string) => {
  logger.log(`Deleted temporary file: '${path}'`);
};

export const tempFileDeleting = (path: string) => {
  logger.log(`Deleting temporary file: '${path}'`);
};

export const remoteFileDeleted = (path: string) => {
  logger.log(`Deleted original file from storage bucket: '${path}'`);
};

export const remoteFileDeleting = (path: string) => {
  logger.log(`Deleting original file from storage bucket: '${path}'`);
};

export const errorOutputOptionsParse = (err: any) => {
  logger.error(
    `Error while parsing "Output options for selected format". Parameter will be ignored`,
    err
  );
};

export const threatVerdict  = (verdict: string) => {
  logger.log(`File threat verdict '${verdict}'`);
};
