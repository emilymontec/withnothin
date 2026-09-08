export interface UploadUrlResponse {
  mediaId: string;
  uploadUrl: string;
  path: string;
  token: string;
}

export interface MediaAsset {
  id: string;
  url: string;
  mimeType: string;
  status: 'PENDING' | 'CONFIRMED';
}
