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
import * as functions from "firebase-functions";
import { PangeaConfig, RedactService } from "pangea-node-sdk"

import config from "./config";
import * as logs from "./logs";
import * as validators from "./validators";

enum ChangeType {
  CREATE,
  DELETE,
  UPDATE,
}

// Instantiate a Pangea Configuration object with the end point domain
const redactConfig = new PangeaConfig({ domain: config.pangeaDomain });

// Instantiate the Redact Service using the auth token and config
const redact = new RedactService(config.redactToken, redactConfig);

// Initialize the Firebase Admin SDK
admin.initializeApp();

logs.init(config);

export const fsredact = async (change): Promise<void> => {
  logs.start(config);
  const { inputFieldName, outputFieldName } = config;

  if (validators.fieldNamesMatch(inputFieldName, outputFieldName)) {
    logs.fieldNamesNotDifferent();
    return;
  }

  const changeType = getChangeType(change);

  try {
    switch (changeType) {
      case ChangeType.CREATE:
        await handleCreateDocument(change.value);
        break;
      case ChangeType.DELETE:
        handleDeleteDocument();
        break;
      case ChangeType.UPDATE:
        await handleUpdateDocument(change.oldValue, change.value);
        break;
    }

    logs.complete();
  } catch (err) {
    logs.error(err);
  }
};

const extractInput = (data): any => {
  return data?.fields?.[config.inputFieldName]?.stringValue || data?.fields?.[config.inputFieldName]?.arrayValue;
};

const getChangeType = (
  event
): ChangeType => {
  if (!("value" in event) && 'oldValue' in event) {
    return ChangeType.DELETE;
  } else if (!("oldValue" in event) && 'value' in event) {
    return ChangeType.CREATE;
  }
  return ChangeType.UPDATE;
};

const handleCreateDocument = async (value): Promise<void> => {
  const input = extractInput(value);
  if (input) {
    logs.documentCreatedWithInput();
    await redactDocument(value);
  } else {
    logs.documentCreatedNoInput();
  }
};

const handleDeleteDocument = (): void => {
  logs.documentDeleted();
};

const handleUpdateDocument = async (before, after): Promise<void> => {
  const inputBefore = extractInput(before);
  const inputAfter = extractInput(after);

  // If previous and updated documents have no input, skip.
  if (inputBefore === undefined && inputAfter === undefined) {
    logs.documentUpdatedNoInput();
    return;
  }

  // If updated document has no string or object input, delete any existing translations.
  if (typeof inputAfter !== "string" && typeof inputAfter !== "object") {
    await updateRedaction(after, admin.firestore.FieldValue.delete());
    logs.documentUpdatedDeletedInput();
    return;
  }

  if (JSON.stringify(inputBefore) === JSON.stringify(inputAfter)) {
    logs.documentUpdatedUnchangedInput();
  } else {
    logs.documentUpdatedChangedInput();
    await redactDocument(after);
  }
};

const redactSingle = async (
  input: string,
  docPath
): Promise<void> => {
  logs.redactSingleString(input);

  try {
    const redaction = await redactString(input);
    return updateRedaction(docPath, redaction);

  } catch (err) {
    logs.redactSingleStringError(input, err);
    throw err;
  }
};

const redactMultiple = async (
  input: object,
  docPath
): Promise<void> => {
  let translations = {};
  let promises = [];

  logs.redactMultipleStrings(input);

  Object.entries(input).forEach(([input, value]) => {
    promises.push(
      () =>
        new Promise<void>(async (resolve) => {

          const output =
            typeof value === "string"
              ? await redactString(value)
              : null;

          translations[input] = output;

          return resolve();
        })
    );
  });

  for (const fn of promises) {
    if (fn) await fn();
  }

  logs.redactMultipleStringsComplete(input);

  return updateRedaction(docPath, translations);
};

const redactDocument = async (value): Promise<void> => {
  const input: any = extractInput(value);

  if (typeof input === "object") {
    return redactMultiple(input, value.name);
  }

  await redactSingle(input, value.name);
};

const redactString = async (
  string: string
): Promise<string> => {
  try {
    logs.redactInputString(string);

    const response = await redact.redact(string);
    if (response.success) {
      var redactedString = response.result.redacted_text
    }

    logs.redactStringComplete(redactedString);

    return redactedString;
  } catch (err) {
    logs.redactStringError(string, err);
    throw err;
  }
};

const updateRedaction = async (fullPath, translations: any): Promise<void> => {
  const docId = fullPath.split("/").pop();
  const docPath = `${config.collectionPath}/${docId}`;

  logs.updateDocument(docPath);

  const docRef = await admin.firestore().doc(docPath);

  // Wrapping in transaction to allow for automatic retries (#48)
  await admin.firestore().runTransaction((transaction) => {
    transaction.update(docRef, config.outputFieldName, translations);
    return Promise.resolve();
  });

  logs.updateDocumentComplete(docPath);
};
