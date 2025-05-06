import { baseAPI } from "@/utils/variables";

export const downloadAuditReport = (documentId: number) => {
    const link = document.createElement("a");
    link.href = `${baseAPI}/doc/audit-report/${documentId}/`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };
