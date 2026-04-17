import { RetirementSimulator } from "@/components/simulation/RetirementSimulator";
import { getEmployees } from "@/lib/data";
import { createRetirementSimulation } from "@/lib/retirement-simulation";

interface SimulationPageProps {
  searchParams?: {
    employeeId?: string;
  };
}

export default async function SimulationPage({ searchParams }: SimulationPageProps) {
  const employees = await getEmployees();
  const simulation = createRetirementSimulation(employees, searchParams?.employeeId);

  return <RetirementSimulator employees={employees} simulation={simulation} />;
}
