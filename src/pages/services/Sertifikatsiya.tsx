import ServicePageLayout from "@/components/ServicePageLayout";
import { getServiceBySlug } from "@/data/servicesData";

export default function Sertifikatsiya() {
  const service = getServiceBySlug("sertifikatsiya");
  if (!service) return null;
  return <ServicePageLayout service={service} />;
}
