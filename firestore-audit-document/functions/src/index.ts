/*
 * Pangea Cyber 2023 Pangea Cyber Inc
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
import { PangeaConfig, AuditService, Audit } from "pangea-node-sdk";

import config from "./config";
import strings from "./strings";
import { evaluateChange } from "./utils";

// Instantiate a Pangea Configuration object with the end point domain
const serviceConfig = new PangeaConfig({ domain: config.pangeaDomain });

// Instantiate the domainIntel Service using the auth token and config
const pangeaService = new AuditService(
  config.pangeaServiceToken!,
  serviceConfig
);

// Initialize the Firebase Admin SDK
admin.initializeApp();

functions.logger.log(strings.init, config);

export const firestore_doc_audit = functions.firestore
  .document(config.collectionPath!)
  .onWrite(async (change, context): Promise<void> => {
    functions.logger.log(strings.start, config);

    const { fieldsToAudit } = config;
    const fields = (
      fieldsToAudit?.split(",").map((field) => field.trim()) || []
    ).sort();

    try {
      const changeDetails = evaluateChange(change, fields);

      // Call the service if the document is created, deleted, or selected fields are updated, or no fields are specified
      if (changeDetails.hasChanged) {
        const result = await callService(changeDetails.value);
      }
    } catch (err) {
      functions.logger.error(strings.genericError, err);
    } finally {
      functions.logger.log(strings.complete);
    }
  });

const callService = async (value: Audit.Event) => {
  // Call the service
  functions.logger.log(strings.serviceCallStart, value);
  const { result } = await pangeaService.log(value);
  functions.logger.log(strings.serviceCallComplete, result);
  return result;
};
