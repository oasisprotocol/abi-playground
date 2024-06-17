import { ChangeEvent, useCallback } from "react";
import { CommonInputProps } from "~~/components/scaffold-eth";

type BooleanInputProps = CommonInputProps<boolean> & {
  error?: boolean;
};

export const BooleanInput = ({ name, value, onChange, placeholder, error, disabled }: BooleanInputProps) => {
  let modifier = "";
  if (error) {
    modifier = "border border-error";
  } else if (disabled) {
    modifier = "border border-disabled bg-base-300";
  }

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    },
    [onChange],
  );

  return (
    <div className={`flex bg-neutral rounded-lg text-accent ${modifier}`}>
      <div className="form-control">
        <label className="label cursor-pointer px-4">
          <input
            type="checkbox"
            className="checkbox"
            name={name}
            checked={value}
            onChange={handleChange}
            disabled={disabled}
            autoComplete="off"
          />
          <span className="label-text px-4">{placeholder}</span>
        </label>
      </div>
    </div>
  );
};
