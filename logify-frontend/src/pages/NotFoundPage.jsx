import ErrorStatePage from "../components/ErrorStatePage";

const NOT_FOUND_ILLUSTRATION_URL =
  "https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/no_data_qbuo.svg";

const NotFoundPage = () => {
  return (
    <ErrorStatePage
      code="404"
      title="Page not found."
      description="The page you requested does not exist or may have been moved inside Logify. Return home and continue from a valid section of the platform."
      imageUrl={NOT_FOUND_ILLUSTRATION_URL}
      imageAlt="Not found illustration"
      primaryLabel="Go Home"
      primaryTo="/"
      secondaryLabel="Back"
      secondaryAction={() => window.history.back()}
    />
  );
};

export default NotFoundPage;
