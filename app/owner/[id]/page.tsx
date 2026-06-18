import OwnerDashboardClient from './OwnerDashboardClient';

type RouteProps = {
  params: Promise<{ id: string }>;
};

export default async function OwnerDashboardPage({ params }: RouteProps) {
  const { id } = await params;
  return <OwnerDashboardClient id={id} />;
}
