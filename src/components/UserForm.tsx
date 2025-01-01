import { useState } from "react";
import { Button } from "./ui/button";

interface UserFormProps {
	onSubmit: (data: { name: string; email: string }) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
	const [formData, setFormData] = useState({ name: "", email: "" });

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = () => {
		if (formData.name && formData.email) {
			onSubmit(formData);
		}
	};

	return (
		<section className="p-4 flex-1">
			<h2 className="text-2xl font-semibold">Enter details</h2>
			<div className="flex flex-col gap-4 w-[400px]">
				<div className="flex flex-col gap-2">
					<label htmlFor="name">Name</label>
					<input
						className="border border-gray-300 rounded-md p-2 w-[400px]"
						name="name"
						placeholder="Name"
						value={formData.name}
						onChange={handleChange}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="email">Email</label>
					<input
						className="border border-gray-300 rounded-md p-2 w-[400px]"
						name="email"
						placeholder="Email"
						value={formData.email}
						onChange={handleChange}
					/>
				</div>
				<Button
					type="button"
					onClick={handleSubmit}
					disabled={!formData.name || !formData.email}
				>
					Schedule Event
				</Button>
			</div>
		</section>
	);
};

export default UserForm;
