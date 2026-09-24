'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { ProjectSwitcher } from '@/components/project-switcher';
import { getProjects } from '@/lib/mockApi';
import { Suspense } from 'react';
import { Project } from '@/components/cards/project-cards';
import { NavItem, PageHeader } from '@/components/app-navigation';

export default function GlobalDataLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      }
    >
      <GlobalDataLayoutContent>{children}</GlobalDataLayoutContent>
    </Suspense>
  );
}

export function GlobalDataLayoutContent({ children }: { children: React.ReactNode }) {
  const projects: Project[] = useMemo(() => getProjects(), []);

  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  segments.pop();
  const parentPath = '/' + segments.join('/');

  const { project: projectId } = useParams<{ project: string }>();

  if (!projectId) return;

  const initialProject: Project = projects.find((p) => p.id === projectId) ?? projects[0];
  const [selectedProject, setSelectedProject] = useState(initialProject);

  useEffect(() => {
    const project = projects.find((p) => p.id === projectId) ?? projects[0];

    if (project.id !== selectedProject.id) {
      setSelectedProject(project);
      router.push(`${parentPath}/${selectedProject.id}`);
    }
  }, [projects, selectedProject]);

  const navTabs: NavItem[] | undefined = [
    { title: 'Global Activity', url: `/global-data/${selectedProject.id}`, isActive: true },
    { title: 'Server Activity', url: `/global-data/${selectedProject.id}/servers`, isActive: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        setIcon="Earth"
        setTitle="Global Data"
        setDescription="Monitor worlwide activity per country."
        setSubItem={navTabs}
      />

      <ProjectSwitcher
        projects={projects}
        selectedProjectId={selectedProject.id}
        onChange={setSelectedProject}
      />
      {children}
    </div>
  );
}
