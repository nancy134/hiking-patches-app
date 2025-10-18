import Link from 'next/link';
import Header from '@/components/Header';

export default function AdminDashboard() {
  const sections = [
    {
      title: 'Manage Patches',
      description: 'Create, edit, update and delete patches.',
      href: '/admin/patches',
    },
    {
      title: 'Review Requests',
      description: 'Review user requests for new patches.',
      href: '/admin/requests',
    },
    {
      title: 'Users',
      description: 'See list of users',
      href: '/admin/users',
    },
    {
      title: "Mountains",
      description: "Create, edit, update and delete mountains",
      href: "/admin/mountains"
    },
    {
      title: "Trails",
      description: "Create, edit, update and delete trails",
      href: "/admin/trails"
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Header/>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.title} href={section.href}>
            <div className="border rounded-lg p-6 shadow hover:shadow-md transition cursor-pointer bg-white">
              <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
              <p className="text-gray-600">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

