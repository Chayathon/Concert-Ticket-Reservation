import { Spinner } from "../ui/spinner";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center pt-60">
            <Spinner className="size-20 text-muted-foreground" />
            <p className="pt-4 text-lg text-muted-foreground">Loading...</p>
        </div>
    );
}
