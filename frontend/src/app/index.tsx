import { AuthContainer } from "@/features/auth/AuthContainer";
import { ChecklistContainer } from "@/features/checklist/ChecklistContainer";
import { useAuthStore } from "@/stores/authStore";

export default function Index() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	if (isAuthenticated) {
		return <ChecklistContainer />;
	}

	return <AuthContainer />;
}
