import { act, render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import UnifiedAgentsPanel, {
  type UnifiedAgentsPanelHandle,
} from "@/components/agents/UnifiedAgentsPanel";

const scanUnmanagedMock = vi.fn();
const toggleAgentAppMock = vi.fn();
const uninstallAgentMock = vi.fn();
const importAgentsMock = vi.fn();
const installFromZipMock = vi.fn();
const deleteAgentBackupMock = vi.fn();
const restoreAgentBackupMock = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@/hooks/useAgents", () => ({
  useInstalledAgents: () => ({
    data: [],
    isLoading: false,
  }),
  useAgentBackups: () => ({
    data: [],
    refetch: vi.fn(),
    isFetching: false,
  }),
  useDeleteAgentBackup: () => ({
    mutateAsync: deleteAgentBackupMock,
    isPending: false,
  }),
  useToggleAgentApp: () => ({
    mutateAsync: toggleAgentAppMock,
  }),
  useRestoreAgentBackup: () => ({
    mutateAsync: restoreAgentBackupMock,
    isPending: false,
  }),
  useUninstallAgent: () => ({
    mutateAsync: uninstallAgentMock,
  }),
  useScanUnmanagedAgents: () => ({
    data: [
      {
        directory: "shared-agent",
        name: "Shared Agent",
        description: "Imported from Claude",
        foundIn: ["claude"],
        path: "/tmp/shared-agent",
      },
    ],
    refetch: scanUnmanagedMock,
  }),
  useImportAgentsFromApps: () => ({
    mutateAsync: importAgentsMock,
  }),
  useInstallAgentsFromZip: () => ({
    mutateAsync: installFromZipMock,
  }),
  useCheckAgentUpdates: () => ({
    data: [],
    refetch: vi.fn(),
    isFetching: false,
  }),
  useUpdateAgent: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

describe("UnifiedAgentsPanel", () => {
  beforeEach(() => {
    scanUnmanagedMock.mockResolvedValue({
      data: [
        {
          directory: "shared-agent",
          name: "Shared Agent",
          description: "Imported from Claude",
          foundIn: ["claude"],
          path: "/tmp/shared-agent",
        },
      ],
    });
    toggleAgentAppMock.mockReset();
    uninstallAgentMock.mockReset();
    importAgentsMock.mockReset();
    installFromZipMock.mockReset();
    deleteAgentBackupMock.mockReset();
    restoreAgentBackupMock.mockReset();
  });

  it("opens the import dialog without crashing when app toggles render", async () => {
    const ref = createRef<UnifiedAgentsPanelHandle>();

    render(
      <UnifiedAgentsPanel
        ref={ref}
        onOpenDiscovery={() => {}}
        currentApp="claude"
      />,
    );

    await act(async () => {
      await ref.current?.openImport();
    });

    await waitFor(() => {
      expect(screen.getByText("agents.import")).toBeInTheDocument();
      expect(screen.getByText("Shared Agent")).toBeInTheDocument();
      expect(screen.getByText("/tmp/shared-agent")).toBeInTheDocument();
    });
  });
});
