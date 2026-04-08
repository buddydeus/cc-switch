import { act, render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import UnifiedRulesPanel, {
  type UnifiedRulesPanelHandle,
} from "@/components/rules/UnifiedRulesPanel";

const scanUnmanagedMock = vi.fn();
const toggleRuleAppMock = vi.fn();
const uninstallRuleMock = vi.fn();
const importRulesMock = vi.fn();
const installFromZipMock = vi.fn();
const deleteRuleBackupMock = vi.fn();
const restoreRuleBackupMock = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@/hooks/useRules", () => ({
  useInstalledRules: () => ({
    data: [],
    isLoading: false,
  }),
  useRuleBackups: () => ({
    data: [],
    refetch: vi.fn(),
    isFetching: false,
  }),
  useDeleteRuleBackup: () => ({
    mutateAsync: deleteRuleBackupMock,
    isPending: false,
  }),
  useToggleRuleApp: () => ({
    mutateAsync: toggleRuleAppMock,
  }),
  useRestoreRuleBackup: () => ({
    mutateAsync: restoreRuleBackupMock,
    isPending: false,
  }),
  useUninstallRule: () => ({
    mutateAsync: uninstallRuleMock,
  }),
  useScanUnmanagedRules: () => ({
    data: [
      {
        directory: "shared-rule",
        name: "Shared Rule",
        description: "Imported from Claude",
        foundIn: ["claude"],
        path: "/tmp/shared-rule",
      },
    ],
    refetch: scanUnmanagedMock,
  }),
  useImportRulesFromApps: () => ({
    mutateAsync: importRulesMock,
  }),
  useInstallRulesFromZip: () => ({
    mutateAsync: installFromZipMock,
  }),
  useCheckRuleUpdates: () => ({
    data: [],
    refetch: vi.fn(),
    isFetching: false,
  }),
  useUpdateRule: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

describe("UnifiedRulesPanel", () => {
  beforeEach(() => {
    scanUnmanagedMock.mockResolvedValue({
      data: [
        {
          directory: "shared-rule",
          name: "Shared Rule",
          description: "Imported from Claude",
          foundIn: ["claude"],
          path: "/tmp/shared-rule",
        },
      ],
    });
    toggleRuleAppMock.mockReset();
    uninstallRuleMock.mockReset();
    importRulesMock.mockReset();
    installFromZipMock.mockReset();
    deleteRuleBackupMock.mockReset();
    restoreRuleBackupMock.mockReset();
  });

  it("opens the import dialog without crashing when app toggles render", async () => {
    const ref = createRef<UnifiedRulesPanelHandle>();

    render(
      <UnifiedRulesPanel
        ref={ref}
        onOpenDiscovery={() => {}}
        currentApp="claude"
      />,
    );

    await act(async () => {
      await ref.current?.openImport();
    });

    await waitFor(() => {
      expect(screen.getByText("rules.import")).toBeInTheDocument();
      expect(screen.getByText("Shared Rule")).toBeInTheDocument();
      expect(screen.getByText("/tmp/shared-rule")).toBeInTheDocument();
    });
  });
});
