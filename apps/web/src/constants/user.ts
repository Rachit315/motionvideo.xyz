export const USER = {
  address: {
    country: "India",
    locality: "Mumbai",
  },
  firstName: "Aniket",
  lastName: "Pawar",
  twitter: "@alaymanguy",
} as const;

export const NAME = `${USER.firstName} ${USER.lastName}`;
