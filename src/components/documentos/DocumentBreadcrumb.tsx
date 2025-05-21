
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export interface BreadcrumbPath {
  id: string | null;
  name: string;
}

interface DocumentBreadcrumbProps {
  breadcrumbPath: BreadcrumbPath[];
  onNavigate: (index: number) => void;
}

export function DocumentBreadcrumb({ breadcrumbPath, onNavigate }: DocumentBreadcrumbProps) {
  return (
    <div className="mb-4">
      <Breadcrumb>
        {breadcrumbPath.map((item, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink 
              onClick={() => onNavigate(index)}
              className="cursor-pointer hover:underline"
            >
              {item.name}
            </BreadcrumbLink>
            {index < breadcrumbPath.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </div>
  );
}
