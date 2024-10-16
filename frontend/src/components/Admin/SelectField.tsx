import { FieldError } from "react-hook-form";

type SelectFieldProps = {
  label: string;
  register: any;
  name: string;
  options: { value: string | number; label: string }[];
  defaultValue?: string | number;
  error?: FieldError;
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
};

const SelectField = ({
  label,
  register,
  name,
  options,
  defaultValue,
  error,
  selectProps,
}: SelectFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label className="text-xs text-gray-500">{label}</label>
      <select
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        {...selectProps}
        defaultValue={defaultValue}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
