'use client';

import { useMemo } from 'react';

import { getProjects } from '@/lib/mockApi';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Project, ProjectIcon } from '@/components/cards/project-cards';
import { ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconName } from '@/components/dialogs/project-icon';
import { usePathname, useRouter } from 'next/navigation';

type BannerSize = keyof typeof sizeConfig;

const sizeConfig = {
  xs: { name: 'text-sm', description: 'text-xs' },
  sm: { name: 'text-sm', description: 'text-xs' },
  md: { name: 'text-base', description: 'text-sm' },
  lg: { name: 'text-xl', description: 'text-base' },
} as const;

export function ProjectBanner({
  icon,
  description,
  name,
  color,
  size = 'sm',
  maxDescription,
}: {
  icon: IconName;
  description?: string;
  name: string;
  color?: string;
  size?: BannerSize;
  maxDescription?: number;
}) {
  const s = sizeConfig[size];

  return (
    <div className="flex items-center gap-2">
      <ProjectIcon icon={icon} color={color} size={size} iconClassName="h-4 w-4" />
      <div className="grid">
        <span className={s.name}>{name}</span>
        {description && (
          <span className={cn('text-xs text-muted-foreground', s.description)}>
            {maxDescription ? truncateText(description, maxDescription) : description}
          </span>
        )}
      </div>
    </div>
  );
}

const truncateText = (str: string, limit: number): string => {
  if (str.length <= limit) return str;
  return str.slice(0, limit) + '...';
};

export function ProjectSwitcher({
  projects: projects,
  onChange,
  selectedProjectId,
}: {
  projects: Project[];
  onChange?: (project: Project) => void;
  selectedProjectId?: string;
}) {
  const { isMobile } = useSidebar();

  const activeProject = projects.find((p) => p.id === selectedProjectId) ?? projects[0];

  if (!activeProject) {
    return null;
  }

  return (
    <SidebarMenu className="max-w-70">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <ProjectBanner
                icon={activeProject.icon}
                name={activeProject.name}
                description={activeProject.description}
                color={activeProject.color}
                maxDescription={30}
              />
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Projects
            </DropdownMenuLabel>
            {projects.map((team, index) => {
              return (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => onChange?.(team)}
                  className="gap-2 p-2"
                >
                  <ProjectBanner
                    icon={team.icon}
                    name={team.name}
                    description={team.description}
                    color={team.color}
                    maxDescription={30}
                  />
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">New Project</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function DecisionScreen() {
  const projects = useMemo(() => getProjects(), []);
  const path = usePathname();
  const router = useRouter();

  return (
    <main className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-background p-6 rounded-xl border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(124,58,237,0.12),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(14,165,233,0.10),transparent_30%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
      />

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-4 text-center">
          <p className="text-sm font-medium text-primary">Select a project to continue.</p>
        </div>

        <Command className="w-full rounded-xl border bg-background/85 shadow-2xl shadow-primary/5 backdrop-blur-xl">
          <CommandInput placeholder="Find project..." />

          <CommandList className="max-h-[20vh] overflow-y-auto">
            <CommandEmpty>No results found.</CommandEmpty>

            {projects.map((project) => (
              <CommandItem
                key={project.id}
                value={project.name}
                onSelect={() => {
                  router.push(`${path}/${project.id}`);
                }}
              >
                <ProjectBanner
                  description={project.description}
                  color={project.color}
                  icon={project.icon}
                  name={project.name}
                />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </div>
    </main>
  );
}
