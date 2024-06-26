/*
 * Pangea Cyber 2022 Pangea Cyber Inc
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
import { messages } from "./messages";

export const complete = () => {
  logger.log(messages.complete());
};

export const documentCreatedNoInput = () => {
  logger.log(messages.documentCreatedNoInput());
};

export const documentCreatedWithInput = () => {
  logger.log(messages.documentCreatedWithInput());
};

export const documentDeleted = () => {
  logger.log(messages.documentDeleted());
};

export const documentUpdatedChangedInput = () => {
  logger.log(messages.documentUpdatedChangedInput());
};

export const documentUpdatedDeletedInput = () => {
  logger.log(messages.documentUpdatedDeletedInput());
};

export const documentUpdatedNoInput = () => {
  logger.log(messages.documentUpdatedNoInput());
};

export const documentUpdatedUnchangedInput = () => {
  logger.log(messages.documentUpdatedUnchangedInput());
};

export const error = (err: Error) => {
  logger.error(...messages.error(err));
};

export const fieldNamesNotDifferent = () => {
  logger.error(messages.fieldNamesNotDifferent());
};

export const init = (config: {}) => {
  logger.log(...messages.init(config));
};

export const inputFieldNameIsOutputPath = () => {
  logger.error(messages.inputFieldNameIsOutputPath());
};

export const start = (config: {}) => {
  logger.log(...messages.start(config));
};

export const auditInputString = (string: string) => {
  logger.log(messages.auditInputString(string));
};

export const auditStringComplete = (string: string) => {
  logger.log(messages.auditStringComplete(string));
};

export const auditStringError = (string: string, err: Error) => {
  logger.error(...messages.auditStringError(string, err));
};
export const auditSingleString = (string: string) => {
  logger.log(messages.auditSingleString(string));
};
export const auditSingleStringComplete = (string: string) => {
  logger.log(messages.auditSingleStringComplete(string));
};

export const auditSingleStringError = (string: string, err: Error) => {
  logger.error(...messages.auditSingleStringError(string, err));
};

export const auditMultipleStrings = (input: object) => {
  logger.log(messages.auditMultipleStrings(input));
};
export const auditMultipleStringsComplete = (input: object) => {
  logger.log(messages.auditMultipleStringsComplete(input));
};

export const updateDocument = (path: string) => {
  logger.log(messages.updateDocument(path));
};

export const updateDocumentComplete = (path: string) => {
  logger.log(messages.updateDocumentComplete(path));
};
