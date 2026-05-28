import { MAX_LOGO_FILE_SIZE } from "./constants.js";
import { amoRequest, parseJsonResponse } from "./client.js";

function validateLogoFile(logoFile) {
  if (!logoFile) {
    return;
  }

  if (!["image/jpeg", "image/png"].includes(logoFile.type)) {
    throw new Error("Logo file must be JPG or PNG.");
  }

  if (!logoFile.size || logoFile.size > MAX_LOGO_FILE_SIZE) {
    throw new Error("Logo file must be no larger than 3 MB.");
  }

  if (!logoFile.base64) {
    throw new Error("Logo file content is empty.");
  }
}

function decodeBase64File(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

async function getAmoCRMDriveUrl(token, amoBaseUrl) {
  const account = await amoRequest("/api/v4/account?with=drive_url", token, null, {
    method: "GET",
    defaultBaseUrl: amoBaseUrl,
  });
  const driveUrl = account?.drive_url ?? account?._links?.drive_url?.href;

  if (!driveUrl) {
    throw new Error("AmoCRM drive_url was not found. Check Files Access scope for the integration.");
  }

  return driveUrl.replace(/\/$/, "");
}

export async function uploadLogoFileToAmoCRM(logoFile, token, amoBaseUrl) {
  validateLogoFile(logoFile);

  const driveUrl = await getAmoCRMDriveUrl(token, amoBaseUrl);
  const session = await amoRequest(
    "/v1.0/sessions",
    token,
    {
      file_name: logoFile.name,
      file_size: logoFile.size,
      content_type: logoFile.type,
      with_preview: true,
    },
    { baseUrl: driveUrl },
  );

  const bytes = decodeBase64File(logoFile.base64);
  const maxPartSize = session.max_part_size || bytes.length;
  let uploadUrl = session.upload_url;
  let uploadedFile = null;

  for (let offset = 0; offset < bytes.length; offset += maxPartSize) {
    const chunk = bytes.slice(offset, Math.min(offset + maxPartSize, bytes.length));
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": logoFile.type,
      },
      body: chunk,
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`AmoCRM file upload failed with ${response.status}: ${text}`);
    }

    const data = parseJsonResponse(text, "file upload");

    if (data?.uuid) {
      uploadedFile = data;
    } else if (data?.next_url) {
      uploadUrl = data.next_url;
    }
  }

  if (!uploadedFile?.uuid) {
    throw new Error("AmoCRM file upload did not return file uuid.");
  }

  return uploadedFile;
}
