"use client";

import { useActionState, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { StatusPill, type StatusValue } from "@/components/ui/status-pill";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { confirmReceiptAction } from "@/lib/receiving/actions";
import { formatCopyNumber } from "@/lib/receiving/format";
import { formatBookFormat, formatIsbn13 } from "@/lib/inventory/format";
import type {
  FormState,
  ReceiptDiscrepancy,
  Shipment,
  ShipmentCopy,
  ShipmentItem,
} from "@/lib/receiving/types";

const STEPS = ["Review", "Verify", "Confirm"] as const;
type Step = (typeof STEPS)[number];

const initialState: FormState = {};

type FlatCopy = {
  copy: ShipmentCopy;
  item: ShipmentItem;
};

export function ReceivingStepper({ shipment }: { shipment: Shipment }) {
  const [step, setStep] = useState<Step>("Review");
  const [state, formAction, pending] = useActionState(
    confirmReceiptAction,
    initialState,
  );

  const copies = useMemo<FlatCopy[]>(
    () =>
      shipment.items.flatMap((item) =>
        item.copies.map((copy) => ({ copy, item })),
      ),
    [shipment.items],
  );
  const receivable = copies.filter((row) => row.copy.status === "DISTRIBUTED");
  const alreadyOnHand = copies.filter(
    (row) => row.copy.status === "IN_STOCK_LIBRARY",
  );

  const [received, setReceived] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(receivable.map(({ copy }) => [copy.id, true])),
  );
  const [discrepancy, setDiscrepancy] = useState<
    Record<string, ReceiptDiscrepancy>
  >(() =>
    Object.fromEntries(receivable.map(({ copy }) => [copy.id, "NONE"])),
  );

  const receivedCount = receivable.filter(({ copy }) => received[copy.id]).length;

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-wrap gap-2" aria-label="Receiving steps">
        {STEPS.map((name, index) => {
          const current = name === step;
          return (
            <li key={name}>
              <button
                type="button"
                onClick={() => setStep(name)}
                className={
                  current
                    ? "rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                    : "rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                }
                aria-current={current ? "step" : undefined}
              >
                {index + 1}. {name}
              </button>
            </li>
          );
        })}
      </ol>

      {step === "Review" ? (
        <Card>
          <CardHeader>
            <CardTitle>Shipment {shipment.code}</CardTitle>
            <CardDescription>
              From {shipment.publisher.name}. Review expected editions, then
              verify physical copies.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {shipment.notes ? (
              <p className="text-sm text-muted-foreground">{shipment.notes}</p>
            ) : null}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Edition</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead className="text-right">Expected</TableHead>
                  <TableHead className="text-right">Still in transit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipment.items.map((item) => {
                  const inTransit = item.copies.filter(
                    (copy) => copy.status === "DISTRIBUTED",
                  ).length;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium">{item.edition.book.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatBookFormat(item.edition.format)} ·{" "}
                          {item.edition.book.authors}
                        </p>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {formatIsbn13(item.edition.isbn)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {inTransit}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div>
              <Button type="button" onClick={() => setStep("Verify")}>
                Continue to verify
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === "Verify" ? (
        <Card>
          <CardHeader>
            <CardTitle>Verify copies</CardTitle>
            <CardDescription>
              Uncheck any copy that did not arrive. Flag missing or damaged
              units so the publisher can see the discrepancy.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {receivable.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No in-transit copies remain on this shipment.
              </p>
            ) : (
              receivable.map(({ copy, item }) => (
                <div
                  key={copy.id}
                  className="flex flex-col gap-2 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={received[copy.id] ?? true}
                      onChange={(event) =>
                        setReceived((current) => ({
                          ...current,
                          [copy.id]: event.target.checked,
                        }))
                      }
                      className="mt-1 size-4 accent-primary"
                    />
                    <span>
                      <span className="block text-sm font-medium">
                        {formatCopyNumber(copy.copyNumber)} ·{" "}
                        {item.edition.book.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {formatBookFormat(item.edition.format)} ·{" "}
                        {formatIsbn13(item.edition.isbn)}
                      </span>
                    </span>
                  </label>
                  <Select
                    aria-label={`Discrepancy for copy ${copy.copyNumber}`}
                    className="sm:w-40"
                    value={discrepancy[copy.id] ?? "NONE"}
                    onChange={(event) =>
                      setDiscrepancy((current) => ({
                        ...current,
                        [copy.id]: event.target.value as ReceiptDiscrepancy,
                      }))
                    }
                    options={[
                      { value: "NONE", label: "As expected" },
                      { value: "MISSING", label: "Missing" },
                      { value: "DAMAGED", label: "Damaged" },
                    ]}
                  />
                </div>
              ))
            )}
            {alreadyOnHand.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                {alreadyOnHand.length} cop
                {alreadyOnHand.length === 1 ? "y was" : "ies were"} already
                received on a previous receipt.
              </p>
            ) : null}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("Review")}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setStep("Confirm")}
                disabled={receivable.length === 0}
              >
                Continue to confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === "Confirm" ? (
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="distributionId" value={shipment.id} />
          {receivable.map(({ copy }) => (
            <span key={copy.id}>
              <input type="hidden" name="copyId" value={copy.id} />
              {received[copy.id] ? (
                <input type="hidden" name={`received:${copy.id}`} value="on" />
              ) : null}
              <input
                type="hidden"
                name={`discrepancy:${copy.id}`}
                value={discrepancy[copy.id] ?? "NONE"}
              />
            </span>
          ))}
          <Card>
            <CardHeader>
              <CardTitle>Confirm receipt</CardTitle>
              <CardDescription>
                {receivedCount} of {receivable.length} cop
                {receivable.length === 1 ? "y" : "ies"} will move to on-hand
                inventory. The rest stay in transit and are flagged.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Textarea
                name="notes"
                label="Notes"
                hint="Optional. Visible to the publisher on the receipt."
                rows={3}
              />
              {state.error ? (
                <p className="text-sm text-destructive" role="alert">
                  {state.error}
                </p>
              ) : null}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("Verify")}
                >
                  Back
                </Button>
                <Button type="submit" loading={pending} disabled={receivedCount === 0}>
                  Confirm receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      ) : null}

      {alreadyOnHand.length > 0 && step === "Review" ? (
        <Card>
          <CardHeader>
            <CardTitle>Already on hand</CardTitle>
            <CardDescription>
              Previously received copies from this shipment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1 text-sm">
              {alreadyOnHand.map(({ copy }) => (
                <li key={copy.id} className="flex items-center gap-2">
                  <StatusPill status={copy.status as StatusValue} />
                  {formatCopyNumber(copy.copyNumber)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
