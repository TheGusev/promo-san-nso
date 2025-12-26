import ServicePageLayout from "@/components/ServicePageLayout";
import { getServiceBySlug } from "@/data/servicesData";

export default function Dezodoratsiya() {
  const service = getServiceBySlug("dezodoratsiya");
  if (!service) return null;
  return <ServicePageLayout service={service} />;
}
