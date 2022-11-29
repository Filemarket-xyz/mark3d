const denominator = 1024

/**
 * Formats file size to look like 150 KB, 1 MB, 10 MB and etc.
 * @param size file size in bytes
 */
export const formatFileSize = (size: number): string => {
  if (size < denominator) {
    return `${Math.round(size)} bytes`
  }
  if (size < Math.pow(denominator, 2)) {
    return `${Math.round(size / denominator)} KB`
  }
  if (size < Math.pow(denominator, 3)) {
    return `${Math.round(size / Math.pow(denominator, 2))} MB`
  }
  return `${Math.round(size / Math.pow(denominator, 3))} GB`
}
