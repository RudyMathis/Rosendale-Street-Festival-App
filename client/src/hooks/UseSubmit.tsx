import { useCallback } from "react";

export function useSubmit<T>(
    onSubmit: (data: T) => void,
    resetState?: () => void
) {
    const handleSubmit = useCallback(
        (data: T) => (e: React.FormEvent) => {
            e.preventDefault();
            onSubmit(data);
            if (resetState) resetState();
        },
        [onSubmit, resetState]
    );

    return handleSubmit;
}
