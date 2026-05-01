// src/tests/setupTests.js
import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

jest.mock(
  "react-toastify",
  () => ({
    ToastContainer: () => null,
    toast: {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      dismiss: jest.fn(),
    },
  }),
  { virtual: true },
);

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder;
}
