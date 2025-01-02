import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "./ui/button";

interface UserFormProps {
	onSubmit: (data: { name: string; email: string }) => void;
}

interface UserFormInputs {
	name: string;
	email: string;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<UserFormInputs>({
		mode: "onChange",
	});

	const onSubmitForm: SubmitHandler<UserFormInputs> = (data) => {
		onSubmit(data);
	};

	return (
		<section className="p-4 flex-1">
			<h2 className="text-2xl font-semibold">Enter details</h2>
			<form
				onSubmit={handleSubmit(onSubmitForm)}
				className="flex flex-col gap-4 w-[400px]"
			>
				<div className="flex flex-col gap-2">
					<label htmlFor="name">Name</label>
					<input
						className="border border-gray-300 rounded-md p-2 w-[400px]"
						id="name"
						{...register("name", { required: "Name is required" })}
						placeholder="Name"
					/>
					{errors.name && (
						<p className="text-red-500 text-sm">{errors.name.message}</p>
					)}
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="email">Email</label>
					<input
						className="border border-gray-300 rounded-md p-2 w-[400px]"
						id="email"
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
								message: "Invalid email address",
							},
						})}
						placeholder="Email"
					/>
					{errors.email && (
						<p className="text-red-500 text-sm">{errors.email.message}</p>
					)}
				</div>
				<Button type="submit" disabled={!isValid}>
					Schedule Event
				</Button>
			</form>
		</section>
	);
};

export default UserForm;
