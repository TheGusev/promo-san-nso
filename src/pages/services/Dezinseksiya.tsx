import ServicePageLayout from "@/components/ServicePageLayout";
import { getServiceBySlug } from "@/data/servicesData";

export default function Dezinseksiya() {
  const service = getServiceBySlug("dezinseksiya");
  if (!service) return null;
  return <ServicePageLayout service={service} />;
}
