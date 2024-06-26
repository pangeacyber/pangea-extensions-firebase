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

export const redactInputString = (string: string) => {
  logger.log(messages.redactInputString(string));
};

export const redactStringComplete = (string: string) => {
  logger.log(messages.redactStringComplete(string));
};

export const redactStringError = (string: string, err: Error) => {
  logger.error(...messages.redactStringError(string, err));
};
export const redactSingleString = (string: string) => {
  logger.log(messages.redactSingleString(string));
};
export const redactSingleStringComplete = (string: string) => {
  logger.log(messages.redactSingleStringComplete(string));
};

export const redactSingleStringError = (string: string, err: Error) => {
  logger.error(...messages.redactSingleStringError(string, err));
};

export const redactMultipleStrings = (input: object) => {
  logger.log(messages.redactMultipleStrings(input));
};
export const redactMultipleStringsComplete = (input: object) => {
  logger.log(messages.redactMultipleStringsComplete(input));
};

export const updateDocument = (path: string) => {
  logger.log(messages.updateDocument(path));
};

export const updateDocumentComplete = (path: string) => {
  logger.log(messages.updateDocumentComplete(path));
};
