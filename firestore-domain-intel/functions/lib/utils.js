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
exports.deleteDocumentField = exports.createDocument = exports.updateDocument = exports.evaluateChange = exports.ChangeType = void 0;
const functions = require("firebase-functions");
const firestore_1 = require("firebase-admin/firestore");
const firebase_admin_1 = require("firebase-admin");
const strings_1 = require("./strings");
var ChangeType;
(function (ChangeType) {
    ChangeType[ChangeType["NOOP"] = 0] = "NOOP";
    ChangeType[ChangeType["CREATE"] = 1] = "CREATE";
    ChangeType[ChangeType["DELETE"] = 2] = "DELETE";
    ChangeType[ChangeType["UPDATE"] = 3] = "UPDATE";
})(ChangeType = exports.ChangeType || (exports.ChangeType = {}));
;
const evaluateChange = (change, fieldName) => {
    const oldValue = change?.before?.get(fieldName);
    const value = change?.after?.get(fieldName);
    const changeDetails = {
        type: ChangeType.DELETE,
        oldValue,
        value,
        hasChanged: true,
    };
    // Doc is created but field is not set
    if (!oldValue && !value) {
        changeDetails.type = ChangeType.NOOP;
    }
    // Field is deleted
    else if (oldValue && !value) {
        changeDetails.type = ChangeType.DELETE;
    }
    // Field is populated with value
    else if (!oldValue && value) {
        changeDetails.type = ChangeType.CREATE;
    }
    // Field is updated
    else {
        changeDetails.type = ChangeType.UPDATE;
        changeDetails.hasChanged = JSON.stringify(value).localeCompare(JSON.stringify(oldValue)) !== 0;
    }
    ;
    return changeDetails;
};
exports.evaluateChange = evaluateChange;
const updateDocument = async (snapshot, fieldName, value) => {
    functions.logger.log(strings_1.default.updateDocumentStart, snapshot.ref.path);
    // Wrapping in transaction to allow for automatic retries (#48)
    await (0, firebase_admin_1.firestore)().runTransaction((transaction) => {
        transaction.update(snapshot.ref, fieldName, value);
        return Promise.resolve();
    });
    functions.logger.log(strings_1.default.updateDocumentComplete, snapshot.ref.path);
};
exports.updateDocument = updateDocument;
const createDocument = async (collectionPath, docId, payload) => {
    return (0, firebase_admin_1.firestore)().collection(collectionPath).doc(docId).set(payload);
};
exports.createDocument = createDocument;
const deleteDocumentField = async (collectionPath, docId, field) => {
    const doc = await (0, firebase_admin_1.firestore)().collection(collectionPath).doc(docId).get();
    if (doc.exists) {
        return (0, firebase_admin_1.firestore)().collection(collectionPath).doc(docId).update({ [field]: firestore_1.FieldValue.delete() });
    }
    return Promise.resolve();
};
exports.deleteDocumentField = deleteDocumentField;
