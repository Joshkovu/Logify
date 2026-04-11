import ErrorStatePage from "../components/ErrorStatePage";

const SERVER_ILLUSTRATION_URL =
  "https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/server_status_5pbv.svg";

const ServerErrorPage = () => {
  return (
    <ErrorStatePage
      code="500"
      title="Internal server problem."
      description="Logify could not complete this request right now. Your internship records are still safe. Return to a stable page and try again in a moment."
      imageUrl={SERVER_ILLUSTRATION_URL}
      imageAlt="Server status illustration"
      primaryLabel="Go Home"
      primaryTo="/"
      secondaryLabel="Try Again"
      secondaryAction={() => window.location.reload()}
    />
  );
};

export default ServerErrorPage;
