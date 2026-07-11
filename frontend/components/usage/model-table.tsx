"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ModelRollup } from "@/components/usage/types";

type ModelTableProps = {
  rows: ModelRollup[];
};

export function ModelTable({ rows }: ModelTableProps) {
  const cheapestModel = rows.length > 0 ? rows[rows.length - 1].model : null;
  const priciestModel = rows.length > 0 ? rows[0].model : null;

  return (
    <Card className="doodle-border h-full">
      <CardHeader>
        <CardTitle>Per-model breakdown</CardTitle>
        <CardDescription>Sorted by cost, priciest first.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead className="text-right">Requests</TableHead>
              <TableHead className="text-right">Tokens</TableHead>
              <TableHead className="text-right">Est. cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.model}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{row.model}</span>
                    {row.model === cheapestModel && (
                      <Badge className="bg-secondary text-secondary-foreground">
                        cheapest
                      </Badge>
                    )}
                    {row.model === priciestModel && rows.length > 1 && (
                      <Badge className="bg-primary text-primary-foreground">
                        priciest
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {row.requests.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {row.tokens.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${row.cost.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
