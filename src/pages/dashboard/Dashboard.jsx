import Layout from "../../components/Layout";
import Stats from "../booking/Stats";

export default function Dashboard() {
	return (
		<Layout title={"Dashboard"}>
			<div className="w-full flex">
				<Stats />
			</div>
		</Layout>
	);
}
