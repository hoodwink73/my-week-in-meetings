export default function getUserDomain(firebaseUser) {
  const [{ email }] = firebaseUser.providerData.filter(
    ({ providerId }) => providerId === "google.com"
  );

  const [_, domain] = email.split("@");
  return domain;
}
