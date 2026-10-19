// The skill pack sold on /motionvideo-skill. Buyers get access to the private
// repository through the Dodo Payments customer portal.
export const SKILL = {
  INSTALL_COMMAND:
    "npx skills add https://github.com/motionvideohq/motionvideo-skill.git --skill '*' -a claude-code -y",
  REPO: "https://github.com/motionvideohq/motionvideo-skill",
} as const;
