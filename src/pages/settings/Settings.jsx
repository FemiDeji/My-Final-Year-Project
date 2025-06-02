import Layout from "../../components/Layout";
import UpdatePasswordForm from "../auth/UpdatePasswordForm";
import UpdateUserDataForm from "../auth/UpdateUserDataForm";

export default function Settings() {
	return (
		<Layout title={"Settings"}>
			<div className="w-full flex flex-col gap-5 justify-center items-start overflow-auto h-[65vh]">
				<UpdateUserDataForm />
				<UpdatePasswordForm />
			</div>
		</Layout>
	);
}
