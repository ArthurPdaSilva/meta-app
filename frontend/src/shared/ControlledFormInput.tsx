import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { FormInput, type FormInputProps } from "./FormInput";

export interface ControlledFormInputProps<T extends FieldValues>
	extends Omit<FormInputProps, "value" | "onChangeText" | "error"> {
	control: Control<T>;
	name: Path<T>;
}

export function ControlledFormInput<T extends FieldValues>({
	control,
	name,
	...rest
}: ControlledFormInputProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<FormInput
					value={value}
					onChangeText={onChange}
					error={error?.message}
					{...rest}
				/>
			)}
		/>
	);
}
