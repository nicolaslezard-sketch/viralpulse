export function uploadToR2(
  uploadUrl: string,
  file: File,
  onProgress?: (p: number) => void
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = e => {
      if (!e.lengthComputable) return;
      onProgress?.(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload failed ${xhr.status}`));

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(file);
  });
}
