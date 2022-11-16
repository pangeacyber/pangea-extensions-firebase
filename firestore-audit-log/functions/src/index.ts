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
import {PangeaConfig, AuditService} from "pangea-node-sdk"

import config from "./config";
import * as logs from "./logs";
import * as validators from "./validators";

enum ChangeType {
  CREATE,
  DELETE,
  UPDATE,
}

// Instantiate a Pangea Configuration object with the end point domain
const auditConfig = new PangeaConfig({ domain: config.pangeaDomain });

// Instantiate the Audit Service using the auth token and config
const audit = new AuditService(config.auditToken, auditConfig);

// Initialize the Firebase Admin SDK
admin.initializeApp();

logs.init(config);

export const fslog = functions.handler.firestore.document.onWrite(
  async (change): Promise<void> => {
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
          await handleCreateDocument(change.after);
          break;
        case ChangeType.DELETE:
          handleDeleteDocument();
          break;
        case ChangeType.UPDATE:
          await handleUpdateDocument(change.before, change.after);
          break;
      }

      logs.complete();
    } catch (err) {
      logs.error(err);
    }
  }
);

const extractInput = (snapshot: admin.firestore.DocumentSnapshot): any => {
  return snapshot.get(config.inputFieldName);
};

const getChangeType = (
  change: functions.Change<admin.firestore.DocumentSnapshot>
): ChangeType => {
  if (!change.after.exists) {
    return ChangeType.DELETE;
  }
  if (!change.before.exists) {
    return ChangeType.CREATE;
  }
  return ChangeType.UPDATE;
};

const handleCreateDocument = async (
  snapshot: admin.firestore.DocumentSnapshot
): Promise<void> => {
  const input = extractInput(snapshot);
  if (input) {
    logs.documentCreatedWithInput();
    await logDocument(snapshot);
  } else {
    logs.documentCreatedNoInput();
  }
};

const handleDeleteDocument = (): void => {
  logs.documentDeleted();
};

const handleUpdateDocument = async (
  before: admin.firestore.DocumentSnapshot,
  after: admin.firestore.DocumentSnapshot
): Promise<void> => {
  const inputBefore = extractInput(before);
  const inputAfter = extractInput(after);

  // If previous and updated documents have no input, skip.
  if (inputBefore === undefined && inputAfter === undefined) {
    logs.documentUpdatedNoInput();
    return;
  }

  // If updated document has no string or object input, delete any existing translations.
  if (typeof inputAfter !== "string" && typeof inputAfter !== "object") {
    await updateResponse(after, admin.firestore.FieldValue.delete());
    logs.documentUpdatedDeletedInput();
    return;
  }

  if (JSON.stringify(inputBefore) === JSON.stringify(inputAfter)) {
    logs.documentUpdatedUnchangedInput();
  } else {
    logs.documentUpdatedChangedInput();
    await logDocument(after);
  }
};

const logSingle = async (
  input: string,
  snapshot: admin.firestore.DocumentSnapshot
): Promise<void> => {
  logs.auditSingleString(input);

  try {

    const response = await logString(input);
    return updateResponse(snapshot, response);

  } catch (err) {
    logs.auditSingleStringError(input, err);
    throw err;
  }
};

const logMultiple = async (
  input: object,
  snapshot: admin.firestore.DocumentSnapshot
): Promise<void> => {
  let translations = {};
  let promises = [];

  logs.auditMultipleStrings(input);

  Object.entries(input).forEach(([input, value]) => {
      promises.push(
        () =>
          new Promise<void>(async (resolve) => {

            const output =
              typeof value === "string"
                ? await logString(value)
                : null;

            translations[input] = output;

            return resolve();
          })
      );
  });

  for (const fn of promises) {
    if (fn) await fn();
  }

  logs.auditMultipleStringsComplete(input);

  return updateResponse(snapshot, translations);
};

const logDocument = async (
  snapshot: admin.firestore.DocumentSnapshot
): Promise<void> => {
  const input: any = extractInput(snapshot);

  if (typeof input === "object") {
    return logMultiple(input, snapshot);
  }

  await logSingle(input, snapshot);
};

const logString = async (
  string: string
): Promise<any> => {
  try {
    logs.auditInputString(string);

    const data = {
      message: string,
    };

    const response = await audit.log(data);
    logs.auditStringComplete(response.result);

    return response.result;
  } catch (err) {
    logs.auditStringError(string, err);
    throw err;
  }
};

const updateResponse = async (
  snapshot: admin.firestore.DocumentSnapshot,
  responses: any
): Promise<void> => {
  logs.updateDocument(snapshot.ref.path);

  // Wrapping in transaction to allow for automatic retries (#48)
  await admin.firestore().runTransaction((transaction) => {
    transaction.update(snapshot.ref, config.outputFieldName, responses);
    return Promise.resolve();
  });

  logs.updateDocumentComplete(snapshot.ref.path);
};
