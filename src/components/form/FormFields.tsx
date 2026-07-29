import type { ReactNode } from "react";
import { useFormContext, Controller, type FieldValues, type Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BaseProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

function FieldShell({
  id,
  label,
  description,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** RHF-connected text input. */
export function TextField<T extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  required,
  disabled,
  type = "text",
}: BaseProps<T> & { type?: string }) {
  const { register, formState } = useFormContext<T>();
  const error = formState.errors?.[name]?.message as string | undefined;
  return (
    <FieldShell id={name} label={label} description={description} error={error} required={required}>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled || formState.isSubmitting}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...register(name)}
      />
    </FieldShell>
  );
}

/** RHF-connected textarea. */
export function TextAreaField<T extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  required,
  disabled,
  rows = 4,
}: BaseProps<T> & { rows?: number }) {
  const { register, formState } = useFormContext<T>();
  const error = formState.errors?.[name]?.message as string | undefined;
  return (
    <FieldShell id={name} label={label} description={description} error={error} required={required}>
      <Textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled || formState.isSubmitting}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...register(name)}
      />
    </FieldShell>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

/** RHF-connected select built on shadcn primitives. */
export function SelectField<T extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  required,
  disabled,
  options,
  loading,
}: BaseProps<T> & { options: SelectOption[]; loading?: boolean }) {
  const { control, formState } = useFormContext<T>();
  const error = formState.errors?.[name]?.message as string | undefined;
  return (
    <FieldShell id={name} label={label} description={description} error={error} required={required}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled || loading || formState.isSubmitting}
          >
            <SelectTrigger id={name} aria-invalid={Boolean(error)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FieldShell>
  );
}
