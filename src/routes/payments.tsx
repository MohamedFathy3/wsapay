import { createFileRoute, Outlet } from "@tanstack/react-router";

// غيرنا الاسم من PaymentsLayout إلى PaymentsRoute
export const Route = createFileRoute("/payments")({
  component: PaymentsRoute,
});

function PaymentsRoute() {
  return (
    <div className="">
      <Outlet />
    </div>
  );
}
