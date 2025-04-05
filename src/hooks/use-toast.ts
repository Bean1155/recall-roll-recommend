
// This is a wrapper around the toast component
import { toast } from "@/components/ui/toast";
import { useToast as useShadcnToast } from "@/components/ui/toast";

export const useToast = useShadcnToast;
export { toast };
