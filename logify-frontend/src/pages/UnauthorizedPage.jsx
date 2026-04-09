import ErrorStatePage from "../components/ErrorStatePage";

const UNAUTHORIZED_ILLUSTRATION_URL =
  "https://raw.githubusercontent.com/cuuupid/undraw-illustrations/master/svg/security_o890.svg";

const UnauthorizedPage = () => {
  return (
    <ErrorStatePage
      code="401"
      title="Unauthorized access."
      description="You need the right account session to open this part of Logify. Sign in again or Sign Up or return to a page that is available for your current role."
      imageUrl={UNAUTHORIZED_ILLUSTRATION_URL}
      imageAlt="Security access illustration"
      primaryLabel="Auth Page"
      primaryTo="/auth"
      secondaryLabel="Go Home"
      secondaryTo="/"
    />
  );
};

export default UnauthorizedPage;
