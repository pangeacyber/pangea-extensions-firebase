"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore_doc_audit = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const pangea_node_sdk_1 = require("pangea-node-sdk");
const config_1 = require("./config");
const strings_1 = require("./strings");
const utils_1 = require("./utils");
// Instantiate a Pangea Configuration object with the end point domain
const serviceConfig = new pangea_node_sdk_1.PangeaConfig({ domain: config_1.default.pangeaDomain });
// Instantiate the domainIntel Service using the auth token and config
const pangeaService = new pangea_node_sdk_1.AuditService(config_1.default.pangeaServiceToken, serviceConfig);
// Initialize the Firebase Admin SDK
admin.initializeApp();
functions.logger.log(strings_1.default.init, config_1.default);
exports.firestore_doc_audit = functions.firestore.document(config_1.default.collectionPath).onWrite(async (change, context) => {
    functions.logger.log(strings_1.default.start, config_1.default);
    const { fieldsToAudit } = config_1.default;
    const fields = (fieldsToAudit?.split(",").map((field) => field.trim()) || []).sort();
    try {
        const changeDetails = (0, utils_1.evaluateChange)(change, fields);
        // Call the service if the document is created, deleted, or selected fields are updated, or no fields are specified
        if (changeDetails.hasChanged) {
            const result = await callService(changeDetails.value);
        }
    }
    catch (err) {
        functions.logger.error(strings_1.default.genericError, err);
    }
    finally {
        functions.logger.log(strings_1.default.complete);
    }
});
const callService = async (value) => {
    // Call the service
    functions.logger.log(strings_1.default.serviceCallStart, value);
    const { result } = await pangeaService.log(value);
    functions.logger.log(strings_1.default.serviceCallComplete, result);
    return result;
};
