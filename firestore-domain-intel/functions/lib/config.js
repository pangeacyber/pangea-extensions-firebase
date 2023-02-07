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
exports.default = {
    location: process.env.LOCATION,
    collectionPath: process.env.COLLECTION_PATH,
    inputFieldName: process.env.INPUT_FIELD_NAME,
    outputFieldName: process.env.OUTPUT_FIELD_NAME,
    pangeaDomain: process.env.PANGEA_DOMAIN,
    pangeaDomainIntelToken: process.env.PANGEA_DOMAIN_INTEL_TOKEN,
    pangeaDomainIntelProvider: process.env.DOMAIN_INTEL_PROVIDER,
    autoUserLookup: process.env.AUTO_USER_LOOKUP
};
