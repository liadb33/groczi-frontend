import { CustomRTLToast } from "@/components/ui/CustomRTLToast"; // adjust path as needed

export const toastConfig = {
  success: (props: any) => <CustomRTLToast {...props} />,
  error: (props: any) => (
    <CustomRTLToast
      {...props}
      style={{ borderColor: "#D7263D", borderRightColor: "#D7263D" }}
    />
  ),
  info: (props: any) => (
    <CustomRTLToast
      {...props}
      style={{ borderColor: "#2E86DE", borderRightColor: "#2E86DE" }}
    />
  ),
};
