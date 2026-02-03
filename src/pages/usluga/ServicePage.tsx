import { useParams, Navigate } from "react-router-dom";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";
import { getServiceBySlug } from "@/data/services";

export default function ServicePage() {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  
  if (!serviceSlug) {
    return <Navigate to="/uslugi" replace />;
  }

  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    return <Navigate to="/uslugi" replace />;
  }

  return <ServicePageTemplate service={service} />;
}
