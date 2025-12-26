import ServicePageLayout from "@/components/ServicePageLayout";
import { getServiceBySlug } from "@/data/servicesData";

export default function Ozonirovanie() {
  const service = getServiceBySlug("ozonirovanie");
  if (!service) return null;
  return <ServicePageLayout service={service} />;
}
