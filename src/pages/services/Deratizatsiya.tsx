import ServicePageLayout from "@/components/ServicePageLayout";
import { getServiceBySlug } from "@/data/servicesData";

export default function Deratizatsiya() {
  const service = getServiceBySlug("deratizatsiya");
  if (!service) return null;
  return <ServicePageLayout service={service} />;
}
