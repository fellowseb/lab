interface ErrorDisplayProps {
  error: unknown;
}

/**
 * Error display component.
 */
const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  const errorMsg =
    error instanceof Error ? error.message : "Unexpected error type";
  return <p>{errorMsg}</p>;
};

export default ErrorDisplay;
