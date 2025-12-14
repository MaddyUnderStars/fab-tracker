import { Spinner } from "./ui/spinner";

export const LoadingComponent = () => {
	return (
		<div className="w-full h-full flex justify-center items-center">
			<Spinner className="size-9" />
		</div>
	);
};
