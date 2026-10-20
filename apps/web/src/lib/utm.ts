import { UTM_PARAMS } from "@/constants/site";

// Tag outbound links to sites we own so their analytics can attribute the
// visit. `placement` says where on this site the link lives, e.g. "footer".
export const withUtm = (url: string, placement: string): string => {
  const target = new URL(url);
  for (const [key, value] of Object.entries(UTM_PARAMS)) {
    target.searchParams.set(key, value);
  }
  target.searchParams.set("utm_campaign", placement);
  return target.toString();
};
