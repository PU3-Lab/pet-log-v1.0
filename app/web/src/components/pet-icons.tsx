type PetIconProps = {
  name:
    | "home"
    | "record"
    | "analysis"
    | "suggestions"
    | "profile"
    | "community"
    | "more"
    | "bell"
    | "back"
    | "plus";
  className?: string;
};

const iconPaths: Record<PetIconProps["name"], string> = {
  home: "M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.5Z",
  record: "M7 4h10a1 1 0 0 1 1 1v14l-3-2-3 2-3-2-3 2V5a1 1 0 0 1 1-1Zm3 5h4M10 13h4",
  analysis: "M5 19V9m7 10V5m7 14v-7",
  suggestions: "M12 3a6 6 0 0 0-3 11.2V17h6v-2.8A6 6 0 0 0 12 3Zm-2 18h4",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  community: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a5 5 0 0 1 10 0m-2-2a5 5 0 0 1 10 0",
  more: "M6 12h.01M12 12h.01M18 12h.01",
  bell: "M18 16H6l2-2v-4a4 4 0 0 1 8 0v4l2 2Zm-8 3h4",
  back: "M15 18 9 12l6-6",
  plus: "M12 5v14M5 12h14",
};

export function PetIcon({ name, className }: PetIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
