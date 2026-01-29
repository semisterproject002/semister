import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const OTPInput = ({ value, onChange, disabled }: OTPInputProps) => {
  return (
    <InputOTP
      maxLength={6}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <InputOTPGroup className="gap-2">
        <InputOTPSlot index={0} className="h-12 w-12 text-lg border-border" />
        <InputOTPSlot index={1} className="h-12 w-12 text-lg border-border" />
        <InputOTPSlot index={2} className="h-12 w-12 text-lg border-border" />
        <InputOTPSlot index={3} className="h-12 w-12 text-lg border-border" />
        <InputOTPSlot index={4} className="h-12 w-12 text-lg border-border" />
        <InputOTPSlot index={5} className="h-12 w-12 text-lg border-border" />
      </InputOTPGroup>
    </InputOTP>
  );
};

export default OTPInput;
