import React, { useEffect, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ZodType } from "zod";
import { useMask } from "@react-input/mask";

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  validationSchema: ZodType<any>;
  mask?: string;
  className?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type = "text",
  validationSchema,
  mask,
  className,
  onChange,
  placeholder,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;
  const labelRef = useRef<HTMLLabelElement>(null);

  const inputRef = useMask({
    mask: mask || "",
    replacement: { _: /\d/ },
  });

  const handleInputChange = (value: string) => {
    if (labelRef.current) {
      labelRef.current.classList.toggle("active", Boolean(value));
    }
    if (onChange) {
      onChange(value);
    }
  };

  useEffect(() => {
    if (labelRef.current && inputRef.current) {
      handleInputChange(inputRef.current.value);
    }
  }, [inputRef.current?.value]);

  return (
    <div
      className={`${className} center-col h-fit !items-start app_sm:!w-full`}
    >
      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value) =>
            validationSchema.safeParse(value).success ||
            validationSchema.parse(value),
        }}
        render={({ field }) => (
          <>
            <label
              className={`label ${
                errors[name] ? "!text-[#fd5959]" : ""
              } text-[13px] text-text opacity-100 font-poppins mb-1`}
              htmlFor={name}
              ref={labelRef}
            >
              {label}
            </label>
            <input
              {...field}
              ref={mask ? inputRef : field.ref}
              id={name}
              type={type}
              placeholder={placeholder}
              className={` ${
                errors[name] ? "!border-[#fd5959]" : ""
              } outline-none w-full h-[50px] rounded-[8px] pl-3 border border-solid !border-[#d8d8d8] bg-white  transition-all focus:!border-main placeholder:opacity-65`}
              onChange={(e) => {
                field.onChange(e);
                handleInputChange(e.target.value);
              }}
            />
          </>
        )}
      />
      {errors[name] && (
        <p className="text-[#db3737] font-poppins text-sm">
          {errors[name].message as string}
        </p>
      )}
    </div>
  );
};

export default InputField;
