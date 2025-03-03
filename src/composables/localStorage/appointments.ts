import { useLocalStorage } from "@vueuse/core";

export const appointments = useLocalStorage("appointments", []);
