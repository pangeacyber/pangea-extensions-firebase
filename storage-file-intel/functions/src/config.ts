/*
 * Pangea Cyber 2022 Pangea Cyber Inc
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

export enum deleteImage {
  always = 0,
  never,
  onSuccess,
}

function deleteOriginalFile(deleteType?: string) {
  switch (deleteType) {
    case "true":
      return deleteImage.always;
    case "false":
      return deleteImage.never;
    default:
      return deleteImage.always;
  }
}

function paramToArray(param: unknown) {
  return typeof param === "string" ? param.split(",") : undefined;
}

export default {
  bucket: process.env.IMG_BUCKET,
  isolationPath: process.env.ISOLATION_PATH,
  zipPassword: process.env.ZIP_PASSWORD,
  deleteOriginalFile: deleteOriginalFile(process.env.DELETE_ORIGINAL_FILE),
  includePathList: paramToArray(process.env.INCLUDE_PATH_LIST),
  excludePathList: paramToArray(process.env.EXCLUDE_PATH_LIST),
  pangeaDomain: process.env.PANGEA_DOMAIN,
  pangeaToken: process.env.PANGEA_FILE_INTEL_TOKEN,
  externalNotification: process.env.EXTERNAL_NOTIFICATION_PARAMETER,
};
