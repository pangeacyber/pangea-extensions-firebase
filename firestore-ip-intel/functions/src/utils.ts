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

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { firestore } from "firebase-admin";

import strings from './strings';

export enum ChangeType {
    NOOP,
    CREATE,
    DELETE,
    UPDATE,
};

export type ChangeDetails = {
    type: ChangeType;
    hasChanged: boolean;
    oldValue: any;
    value: any;
};

export const evaluateChange = (change: functions.Change<functions.firestore.DocumentSnapshot>, fieldName: string): ChangeDetails => {
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
    };

    return changeDetails;
}

export const updateDocument = async (
    snapshot: admin.firestore.DocumentSnapshot,
    fieldName: string,
    value: any
): Promise<void> => {
    functions.logger.log(strings.updateDocumentStart, snapshot.ref.path);

    // Wrapping in transaction to allow for automatic retries (#48)
    await firestore().runTransaction((transaction) => {
        transaction.update(snapshot.ref, fieldName, value);
        return Promise.resolve();
    });

    functions.logger.log(strings.updateDocumentComplete, snapshot.ref.path);
};

export const createDocument = async (collectionPath, docId, payload: any) => {
    return firestore().collection(collectionPath).doc(docId).set(payload);
}

export const deleteDocumentField = async (collectionPath, docId, field) => {
    const doc = await firestore().collection(collectionPath).doc(docId).get();
    if (doc.exists) {
        return firestore().collection(collectionPath).doc(docId).update({ [field]: FieldValue.delete() });
    }
    return Promise.resolve();
}