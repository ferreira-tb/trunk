import { toast } from "@/lib/toast";

export function handleError(err: unknown, message?: Option<string>) {
  console.error(err);
  message ??= Error.isError(err) ? err.message : String(err);
  if (message) {
    toast.error(message);
  }
}
