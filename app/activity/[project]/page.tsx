'use client';

import { Suspense, useEffect, useState } from 'react';
import ActivityCanvas from '@/components/activity-canvas';
import { Project } from '@/components/cards/project-cards';
import { ProjectSwitcher } from '@/components/project-switcher';
import { Button } from '@/components/ui/button';
import { getProjects, getActivityForProject, getLogs } from '@/lib/mockApi';
import { FaFileExport } from 'react-icons/fa6';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/app-navigation';

function ActivityContent() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  segments.pop();
  const parentPath = '/' + segments.join('/');

  const { project: projectId } = useParams<{ project: string }>();

  if (!projectId) return;

  const projects: Project[] = getProjects();

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

  const activity = getActivityForProject(selectedProject?.id);
  const logs = getLogs(selectedProject?.id);

  return (
    <div className="h-full w-full space-y-6 overflow-hidden">
      <PageHeader
        setIcon="SquareActivity"
        setTitle="Activity"
        setDescription="Monitor connection activity."
      />

      <div className="flex items-center justify-between gap-4">
        <ProjectSwitcher
          projects={projects}
          selectedProjectId={selectedProject?.id}
          onChange={setSelectedProject}
        />
        <Button variant="outline" title="Export activity">
          <FaFileExport className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <ActivityCanvas
        initialEdges={activity.edges}
        initialNodes={activity.nodes}
        logs={logs}
        className="h-180"
      />
    </div>
  );
}

export default function Activity() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
          Loading activity...
        </div>
      }
    >
      <ActivityContent />
    </Suspense>
  );
}
