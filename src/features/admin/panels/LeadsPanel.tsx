import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatEGP } from "@/core/utils";
import { useI18n } from "@/features/i18n/I18nProvider";
import {
  marketplaceKeys,
  marketplaceRepository,
} from "@/core/repositories/marketplaceRepository";
import type { TranslationKeyLike } from "@/features/marketplace/types";

/** Lead routing operations table. */
export function LeadsPanel() {
  const { t, td, n } = useI18n();
  const { data: leads = [] } = useQuery({
    queryKey: marketplaceKeys.leads(),
    queryFn: () => marketplaceRepository.listLeads(),
  });

  return (
    <section>
      <h2 className="text-lg font-extrabold text-foreground">{t("mkt.admin.leads.title")}</h2>
      <div className="card-surface mt-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "mkt.admin.leads.col.ref",
                "mkt.admin.leads.col.customer",
                "mkt.admin.leads.col.category",
                "mkt.admin.leads.col.location",
                "mkt.admin.leads.col.budget",
                "mkt.admin.leads.col.score",
                "mkt.admin.leads.col.assigned",
                "mkt.admin.leads.col.status",
              ].map((k) => (
                <TableHead key={k} className="text-start">
                  {t(k as TranslationKeyLike)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-mono text-xs">{lead.reference}</TableCell>
                <TableCell className="font-semibold text-foreground">
                  {td(lead.customerName)}
                </TableCell>
                <TableCell>{td(lead.categoryName)}</TableCell>
                <TableCell className="text-muted-foreground">{td(lead.locationLabel)}</TableCell>
                <TableCell>{formatEGP(lead.budget)}</TableCell>
                <TableCell>
                  <div className="flex min-w-24 items-center gap-2">
                    <Progress value={lead.score} className="h-1.5" />
                    <span className="text-xs text-muted-foreground">{n(lead.score)}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {lead.assignedTo ? (
                    td(lead.assignedTo)
                  ) : (
                    <Button size="sm" variant="soft">
                      {t("mkt.admin.leads.assign")}
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      lead.status === "won"
                        ? "default"
                        : lead.status === "lost"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {t(`mkt.lead.status.${lead.status}` as TranslationKeyLike)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
