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
exports.evaluateChange = void 0;
// Evaluate the changes in the Firestore document
const evaluateChange = (change, fields) => {
    const changeDetails = {
        hasChanged: false,
        documentId: change?.after?.id || change?.before?.id,
        value: {
            source: "Firebase client",
            target: "Firestore",
            status: "Completed",
        }
    };
    // Document is deleted
    if (!change?.after?.exists) {
        changeDetails.value.action = "Delete";
    }
    // Document created
    else if (!change?.before?.exists) {
        changeDetails.value.action = "Create";
    }
    // Document updated
    else {
        changeDetails.value.action = "Update";
    }
    ;
    // Get the values we are interested in
    const before = getValues(change?.before?.data(), fields) ?? {};
    const after = getValues(change?.after?.data(), fields) ?? {};
    // Add all the keys from the old and new objects to a set
    const allFields = new Set([...Object.keys(before), ...Object.keys(after)]);
    // Check if the values are different in the old and new objects
    allFields.forEach((field) => {
        // If the field is changed then set the hasChanged flag to true and keep the field in the object
        if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) {
            changeDetails.hasChanged = true;
        }
        // If the field is not changed then remove it from the object
        else {
            delete before[field];
            delete after[field];
        }
    });
    changeDetails.value = { ...changeDetails.value,
        message: `${changeDetails.value.action} document id: ${changeDetails.documentId}`,
        old: before,
        new: after,
    };
    return changeDetails;
};
exports.evaluateChange = evaluateChange;
// getValues
//
// Returns the relevant fields from the data object
//
const getValues = (data, fields) => {
    if (!data || !fields)
        return null;
    return Object.keys(data).reduce((acc, key) => {
        if (fields.length === 0 || fields.includes(key)) {
            acc[key] = data[key];
        }
        return acc;
    }, {});
};
