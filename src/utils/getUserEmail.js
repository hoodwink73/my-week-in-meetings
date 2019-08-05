export default function getUserEmail(firebaseUser) {
  const [{ email }] = firebaseUser.providerData.filter(
    ({ providerId }) => providerId === "google.com"
  );

  return email;
}
