import { Spinner } from "@std/cli/unstable-spinner";

export const useDynamicSpinner = (message: string) => {
  return new Spinner({
    message: message,
  });
};
