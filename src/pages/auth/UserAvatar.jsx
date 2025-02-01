import CustomBackdrop from "../../components/CustomBackdrop";
import useUser from "../../hooks/auth/useUser";

export default function UserAvatar() {
	const { user, isPending } = useUser();

	return (
		<>
			<div className="flex items-center gap-5 text-gray-600 font-medium xs:text-[0.3em] text-[0.5em]">
				<img
					src={user?.user_metadata?.avatar || "./default-user-logo.jpg"}
					alt={`Avatar of ${user?.user_metadata?.fullname}`}
					className="w-10 xs:w-9 aspect-square object-cover object-center rounded-full outline-2 outline outline-gray-100"
				/>
			</div>
			{isPending && <CustomBackdrop open={true} text={"Please wait..."} />}
		</>
	);
}
