export const maxProfilePhotoBytes = 2 * 1024 * 1024;

export type ProfilePhotoFile = {
  size: number;
  type: string;
};

export function getProfilePhotoError(file: ProfilePhotoFile) {
  if (!file.type.startsWith("image/")) {
    return "이미지 파일만 업로드할 수 있습니다.";
  }

  if (file.size > maxProfilePhotoBytes) {
    return "프로필 사진은 2MB 이하로 선택해주세요.";
  }

  return "";
}
