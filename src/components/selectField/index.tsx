import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ZodType } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: Option[];
  validationSchema?: ZodType<any>;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  validationSchema,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="input select relative app_sm:w-full">
      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value) => {
            if (validationSchema) {
              try {
                validationSchema.parse(value);
                return true;
              } catch (e: any) {
                return e.errors[0]?.message || "Invalid value";
              }
            }
            return true;
          },
        }}
        render={({ field }) => (
          <>
            <label
              className="label text-[#000] font-bold opacity-100 mb-1 text-[13px]"
              htmlFor={name}
            >
              {label}
            </label>
            {errors[name] && (
              <p className="text-[#fd5959] text-sm">
                {errors[name].message as string}
              </p>
            )}
            <Select
              {...field}
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger className="outline-none  app_sm:w-full transition-all focus:!border-main select text-text font-poppins_light w-full h-[50px] rounded-[8px] pl-3 border border-solid border-[#cccccc] bg-white">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="z-[9999] min-w-0 font-poppins_light">
                {options.map((option) => (
                  <SelectItem
                    className="py-[10px] px-[20px] text-[16px] font-[400] leading-[1.5rem] my-[6px] text-[#5c5c5c]"
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      />
    </div>
  );
};

export default SelectField;
