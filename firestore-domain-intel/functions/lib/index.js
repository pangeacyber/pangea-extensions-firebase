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
exports.onuserdeleted = exports.onusercreated = exports.pangea_firestore_domain_intel = void 0;
const admin = require("firebase-admin");
const eventarc_1 = require("firebase-admin/eventarc");
const functions = require("firebase-functions");
const pangea_node_sdk_1 = require("pangea-node-sdk");
const config_1 = require("./config");
const strings_1 = require("./strings");
const utils_1 = require("./utils");
// Instantiate a Pangea Configuration object with the end point domain
const serviceConfig = new pangea_node_sdk_1.PangeaConfig({ domain: config_1.default.pangeaDomain });
// Instantiate the domainIntel Service using the auth token and config
const pangeaService = new pangea_node_sdk_1.DomainIntelService(config_1.default.pangeaDomainIntelToken, serviceConfig);
const eventChannel = process.env.EVENTARC_CHANNEL &&
    (0, eventarc_1.getEventarc)().channel(process.env.EVENTARC_CHANNEL, {
        allowedEventTypes: process.env.EXT_SELECTED_EVENTS,
    });
// Initialize the Firebase Admin SDK
admin.initializeApp();
functions.logger.log(strings_1.default.init, config_1.default);
exports.pangea_firestore_domain_intel = functions.firestore.document(config_1.default.collectionPath).onWrite(async (change) => {
    functions.logger.log(strings_1.default.start, config_1.default);
    const { inputFieldName, outputFieldName } = config_1.default;
    // Input and Output fields should be different
    if (inputFieldName.localeCompare(outputFieldName) === 0) {
        functions.logger.log(strings_1.default.fieldNamesNotDifferent);
        return;
    }
    try {
        const changeDetails = (0, utils_1.evaluateChange)(change, inputFieldName);
        // We only make the service call if the change is a CREATE or UPDATE
        if (changeDetails.type === utils_1.ChangeType.CREATE || changeDetails.type === utils_1.ChangeType.UPDATE) {
            // We accept string values only
            if (typeof changeDetails.value !== "string") {
                functions.logger.log(strings_1.default.incorrectValueType, changeDetails.value);
                return;
            }
            // We only make the service call if the value has changed
            if (!changeDetails.hasChanged) {
                functions.logger.log(strings_1.default.valueNotChanged, changeDetails.value);
                return;
            }
            // Call the service
            const result = await callService(changeDetails.value);
            // Store result in Firestore if exists
            if (result) {
                await (0, utils_1.updateDocument)(change.after, config_1.default.outputFieldName, result);
            }
        }
    }
    catch (err) {
        functions.logger.error(strings_1.default.genericError, err);
    }
    finally {
        functions.logger.log(strings_1.default.complete);
    }
});
const onusercreated = async (user) => {
    functions.logger.log(strings_1.default.onUserCreatedHandlerStart, user.uid);
    try {
        if (user.email) {
            const emailDomain = user.email.split("@").pop();
            const result = await callService(emailDomain);
            // Store the result
            if (result) {
                const docCreated = await (0, utils_1.createDocument)(config_1.default.collectionPath, user.uid, { domain_intel: result });
                console.log("Document: ", docCreated);
            }
        }
    }
    catch (err) {
        functions.logger.error(strings_1.default.genericError, err);
    }
    finally {
        functions.logger.log(strings_1.default.onUserCreatedHandlerComplete, user.uid);
    }
};
exports.onusercreated = onusercreated;
const onuserdeleted = async (user) => {
    try {
        const fieldRemoved = await (0, utils_1.deleteDocumentField)(config_1.default.collectionPath, user.uid, "domain_intel");
        console.log("Field Removal: ", fieldRemoved);
    }
    catch (err) {
        functions.logger.error(strings_1.default.genericError, err);
    }
    finally {
        functions.logger.log(strings_1.default.onUserDeletedHandlerComplete, user.uid);
    }
};
exports.onuserdeleted = onuserdeleted;
const callService = async (value) => {
    // Call the service
    functions.logger.log(strings_1.default.serviceCallStart, value);
    const { result } = await pangeaService.lookup(value, { provider: config_1.default.pangeaDomainIntelProvider });
    functions.logger.log(strings_1.default.serviceCallComplete, result);
    return result;
};
