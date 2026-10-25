import PropertyShowcase from '@/components/PropertyShowcase';

export default async function Page({ params }: { params: Promise<{ username: string, data: string }> }) {
  const resolvedParams = await params;
  return <PropertyShowcase data={resolvedParams.data} agentFromUrl={resolvedParams.username} />;
}
