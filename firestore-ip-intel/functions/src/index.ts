/*
 * Pangea Cyber 2023 Pange Cyber Inc
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
import { PangeaConfig, IPIntelService } from "pangea-node-sdk"

import config from "./config";
import strings from './strings';
import { updateDocument, createDocument, deleteDocumentField, evaluateChange, ChangeType } from "./utils";

// Instantiate a Pangea Configuration object with the end point domain
const serviceConfig = new PangeaConfig({ domain: config.pangeaDomain });

// Instantiate the domainIntel Service using the auth token and config
const pangeaService = new IPIntelService(config.pangeaIPIntelToken, serviceConfig);

// Initialize the Firebase Admin SDK
admin.initializeApp();

functions.logger.log(strings.init, config);

export const pangea_firestore_ip_intel = functions.firestore.document(config.collectionPath).onWrite(
  async (change): Promise<void> => {
    functions.logger.log(strings.start, config);

    const { inputFieldName, outputFieldName } = config;

    // Input and Output fields should be different
    if (inputFieldName.localeCompare(outputFieldName) === 0) {
      functions.logger.log(strings.fieldNamesNotDifferent);
      return;
    }

    try {
      const changeDetails = evaluateChange(change, inputFieldName);

      // We only make the service call if the change is a CREATE or UPDATE
      if (changeDetails.type === ChangeType.CREATE || changeDetails.type === ChangeType.UPDATE) {
        // We accept string values only
        if (typeof changeDetails.value !== "string") {
          functions.logger.log(strings.incorrectValueType, changeDetails.value);
          return;
        }

        // We only make the service call if the value has changed
        if (!changeDetails.hasChanged) {
          functions.logger.log(strings.valueNotChanged, changeDetails.value);
          return;
        }

        // Call the service
        const result = await callService(changeDetails.value);
        // Store result in Firestore if exists
        if (result) {
          await updateDocument(change.after, config.outputFieldName, result);
        }
      }
    } catch (err) {
      functions.logger.error(strings.genericError, err);
    } finally {
      functions.logger.log(strings.complete);
    }
  }
);

const callService = async (value: string) => {
  // Call the service
  functions.logger.log(strings.serviceCallStart, value);
  const { result } = await pangeaService.lookup(value, { provider: config.pangeaIPIntelProvider });
  functions.logger.log(strings.serviceCallComplete, result);
  return result;
}
