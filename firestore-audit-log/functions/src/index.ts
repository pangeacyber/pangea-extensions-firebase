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
import * as functionsV2 from "firebase-functions/v2";
import { PangeaConfig, AuditService } from "pangea-node-sdk"

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

export const fslog = async (event, ctx): Promise<void> => {
  logs.start(config);
  const { inputFieldName, outputFieldName } = config;

  if (validators.fieldNamesMatch(inputFieldName, outputFieldName)) {
    logs.fieldNamesNotDifferent();
    return;
  }

  const changeType = getChangeType(event);

  try {
    switch (changeType) {
      case ChangeType.CREATE:
        await handleCreateDocument(event.value);
        break;
      case ChangeType.DELETE:
        handleDeleteDocument();
        break;
      case ChangeType.UPDATE:
        await handleUpdateDocument(event.oldValue, event.value);
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
    await logDocument(value);
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

  // If updated document has no string or object input, delete any existing responses.
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
  docPath
): Promise<void> => {
  logs.auditSingleString(input);
  try {
    const response =
      typeof input === "object"
        ? await logObject(input)
        : typeof input === "string"
          ? await logObject({ message: input })
          : null;

    return updateResponse(docPath, response);
  } catch (err) {
    logs.auditSingleStringError(input, err);
    throw err;
  }
};

const logMultiple = async (
  input: object,
  docPath
): Promise<void> => {
  let responses = {};
  let promises = [];

  logs.auditMultipleStrings(input);

  Object.entries(input).forEach(([index, value]) => {
    promises.push(
      () =>
        new Promise<void>(async (resolve) => {

          const output =
            typeof input === "object"
              ? await logObject(value)
              : typeof input === "string"
                ? await logObject({ message: value })
                : null;

          responses[index] = output;
          return resolve();
        })
    );
  });

  for (const fn of promises) {
    if (fn) await fn();
  }

  logs.auditMultipleStringsComplete(input);

  return updateResponse(docPath, responses);
};

const logDocument = async (value): Promise<void> => {
  const input: any = extractInput(value);
  if (Array.isArray(input)) {
    return logMultiple(input, value.name);
  } else {
    await logSingle(input, value.name);
  }
};

const logObject = async (
  input: object,
): Promise<any> => {
  try {
    logs.auditInputString(JSON.stringify(input));

    const response = await audit.log(input);
    logs.auditStringComplete(response.result);

    return response.result;
  } catch (err) {
    logs.auditStringError(JSON.stringify(input), err);
    return err;
  }
};

const updateResponse = async (
  fullPath,
  responses: any
): Promise<void> => {
  const docId = fullPath.split("/").pop();
  const docPath = `${config.collectionPath}/${docId}`;

  logs.updateDocument(docPath);

  const docRef = await admin.firestore().doc(docPath);

  // Wrapping in transaction to allow for automatic retries (#48)
  await admin.firestore().runTransaction((transaction) => {
    transaction.update(docRef, config.outputFieldName, responses);
    return Promise.resolve();
  });

  logs.updateDocumentComplete(docRef.path);
};

export const onusercreated = async (user): Promise<void> => {
  try {
    const displayName = user.displayName ||
      user.email ||
      user.phoneNumber ||
      user.uid;

    return await logObject({
      message: `User '${displayName}' created.`,
      actor: user.uid,
      target: displayName,
      action: "User Created",
      source: "audit-log-ext",
      status: "Completed",
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const onuserdeleted = async (user): Promise<void> => {
  try {
    const displayName = user.displayName ||
      user.email ||
      user.phoneNumber ||
      user.uid;

    return await logObject({
      message: `User '${displayName}' deleted.`,
      actor: user.uid,
      target: displayName,
      action: "User Deleted",
      source: "audit-log-ext",
      status: "Completed",
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const onmaliciousfiledetected = functionsV2.eventarc.onCustomEventPublished(
  "firebase.extensions.pangea-file-intel.v1.complete",
  async (event) => {
    try {
      return await logObject({
        message: `Malicious file '${event.subject}' neutralize to path '${event.data.output.outputFilePath}'.`,
        actor: event.source,
        action: "Naturalized",
        target: event.data.output.outputFilePath,
        source: event.subject,
        status: event.data.input.metadata.threatVerdict
      });
    } catch (err) {
      return Promise.reject(err);
    }
  });

export const onlogevent = functionsV2.eventarc.onCustomEventPublished(
  "firebase.extensions.pangea-audit-log.v1.log",
  async (event) => {
    try {
      return await logObject(event.data);
    } catch (err) {
      return Promise.reject(err);
    }
  }
);
