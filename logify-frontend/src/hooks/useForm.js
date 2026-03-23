import { useState, useCallback, useEffect } from "react";

/**
 * Custom hook for managing form state
 * @param {object} initialValues - Initial form values
 * @param {Function} onSubmit - Callback when form is submitted
 * @returns {object} Form state and handlers
 */
export const useForm = (initialValues = {}, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched((prev) => ({
      ...prev,
      [name]: isTouched,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitError("");
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      setSubmitError("");
      setIsSubmitting(true);

      try {
        if (onSubmit) {
          await onSubmit(values, { setErrors, setSubmitError, resetForm });
        }
      } catch (error) {
        setSubmitError(error.message || "An error occurred");
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit, resetForm]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitError,
    setValues,
    setErrors,
    setTouched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    getFieldProps: (name) => ({
      name,
      value: values[name] || "",
      onChange: handleChange,
      onBlur: handleBlur,
    }),
  };
};

/**
 * Custom hook for managing async loading state
 * @param {Function} asyncFn - Async function to execute
 * @returns {object} Loading state and execute function
 */
export const useAsync = (asyncFn) => {
  const [state, setState] = useState({
    status: "idle",
    data: null,
    error: null,
  });

  const execute = useCallback(
    async (...args) => {
      setState({ status: "pending", data: null, error: null });
      try {
        const response = await asyncFn(...args);
        setState({ status: "success", data: response, error: null });
        return response;
      } catch (error) {
        setState({
          status: "error",
          data: null,
          error: error.message || "An error occurred",
        });
        throw error;
      }
    },
    [asyncFn]
  );

  return {
    ...state,
    execute,
    isLoading: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
  };
};

/**
 * Custom hook for managing local storage
 * @param {string} key - Local storage key
 * @param {any} initialValue - Initial value
 * @returns {array} [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    [key, value]
  );

  return [value, setStoredValue];
};

/**
 * Custom hook for previous value
 * @param {any} value - Current value
 * @returns {any} Previous value
 */
export const usePrevious = (value) => {
  const ref = useCallback(() => {
    let prev;
    return () => {
      const current = value;
      if (prev !== current) {
        prev = current;
      }
      return prev;
    };
  }, [value])();

  return ref();
};

/**
 * Custom hook for debounced value
 * @param {any} value - Value to debounce
 * @param {number} delay - Debounce delay in ms
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
