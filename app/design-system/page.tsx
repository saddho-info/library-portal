"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonClassName } from "@/components/ui/button-styles";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";
import { StatusPill, type StatusValue } from "@/components/ui/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";

const STATUSES: StatusValue[] = [
  "IN_STOCK_PUBLISHER",
  "DISTRIBUTED",
  "IN_STOCK_LIBRARY",
  "SOLD",
  "RETURNED",
  "LOST",
  "LOW_STOCK",
  "PENDING",
  "SYNCED",
  "FAILED",
  "DISPATCHED",
  "PARTIAL",
];

const COLORS = [
  { name: "Primary", className: "bg-primary" },
  { name: "Secondary", className: "bg-secondary" },
  { name: "Muted", className: "bg-muted" },
  { name: "Success", className: "bg-success" },
  { name: "Warning", className: "bg-warning" },
  { name: "Destructive", className: "bg-destructive" },
  { name: "Info", className: "bg-info" },
  { name: "Ink 900", className: "bg-ink-900" },
];

const SAMPLE_ROWS = [
  { title: "The Silent Archive", isbn: "978-1-4028-9462-6", copies: 240, status: "IN_STOCK_PUBLISHER" as const },
  { title: "River of Ink", isbn: "978-0-306-40615-7", copies: 18, status: "LOW_STOCK" as const },
  { title: "Paper Cities", isbn: "978-3-16-148410-0", copies: 0, status: "SOLD" as const },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const { toast } = useToast();
  const [library, setLibrary] = useState("northside");

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-10">
      <header className="flex flex-col gap-2 border-b border-border pb-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          PubTrack
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Design system</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Shared B2B primitives for the Publisher Dashboard and Library Portal.
          Keep these files identical across both apps until a shared package is
          extracted.
        </p>
      </header>

      <Section title="Color tokens" description="Ink & Paper palette. Light is the default ops theme.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COLORS.map((color) => (
            <div key={color.name} className="overflow-hidden rounded-lg border border-border bg-card">
              <div className={`h-14 ${color.className}`} />
              <p className="px-3 py-2 text-xs font-medium">{color.name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <Card>
          <CardContent className="flex flex-col gap-3 pt-5">
            <p className="text-3xl font-semibold tracking-tight">Page title · 28px</p>
            <p className="text-xl font-semibold">Section heading · 18px</p>
            <p className="text-base font-medium">Card title · 16px</p>
            <p className="text-sm">Body copy · 14px. Inventory counts, table cells, and form labels.</p>
            <p className="text-xs text-muted-foreground">Caption / meta · 12px · ISBN 978-1-4028-9462-6</p>
          </CardContent>
        </Card>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Saving</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Inputs & selects">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Title" placeholder="The Silent Archive" hint="Shown on invoices and packing slips." />
          <Input label="ISBN" placeholder="978-1-4028-9462-6" error="Enter a valid ISBN-13." />
          <Select
            label="Library"
            value={library}
            onChange={(event) => setLibrary(event.target.value)}
            options={[
              { value: "northside", label: "Northside Public" },
              { value: "riverside", label: "Riverside Branch" },
              { value: "campus", label: "Campus Store" },
            ]}
          />
          <Select
            label="Edition"
            placeholder="Select an edition"
            defaultValue=""
            hint="One SKU per print run."
            options={[
              { value: "hb", label: "Hardcover · 2026" },
              { value: "pb", label: "Paperback · 2026" },
            ]}
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Description"
              placeholder="Catalog copy for invoices and library listings."
              hint="Shown on the book detail page."
            />
          </div>
        </div>
      </Section>

      <Section title="Badges & status pills">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="brand">Brand</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="muted">Muted</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <StatusPill key={status} status={status} />
          ))}
        </div>
      </Section>

      <Section title="Card">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Total inventory</CardTitle>
              <CardDescription>Copies currently held at the publisher warehouse.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">12,480</p>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-muted-foreground">Updated just now</span>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Low stock</CardTitle>
              <CardDescription>Editions below the reorder threshold.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight text-warning">6</p>
            </CardContent>
            <CardFooter>
              <Badge variant="warning">Needs attention</Badge>
            </CardFooter>
          </Card>
        </div>
      </Section>

      <Section title="Table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead className="text-right">Copies</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SAMPLE_ROWS.map((row) => (
              <TableRow key={row.isbn}>
                <TableCell className="font-medium">{row.title}</TableCell>
                <TableCell className="font-mono text-xs">{row.isbn}</TableCell>
                <TableCell className="text-right tabular-nums">{row.copies}</TableCell>
                <TableCell>
                  <StatusPill status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section title="Dialog">
        <Dialog>
          <DialogTrigger className={buttonClassName()}>
            Allocate stock
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Allocate to library</DialogTitle>
              <DialogDescription>
                Copies will move from publisher warehouse to Distributed until the library confirms receipt.
              </DialogDescription>
            </DialogHeader>
            <DialogBody className="flex flex-col gap-3">
              <Select
                label="Library"
                defaultValue="northside"
                options={[
                  { value: "northside", label: "Northside Public" },
                  { value: "riverside", label: "Riverside Branch" },
                ]}
              />
              <Input label="Quantity" type="number" defaultValue={25} />
            </DialogBody>
            <DialogFooter>
              <DialogClose className={buttonClassName({ variant: "outline" })}>
                Cancel
              </DialogClose>
              <DialogClose className={buttonClassName()}>
                Confirm allocation
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="Toast">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast({
                variant: "success",
                title: "Sale recorded",
                description: "Copy #A-1842 marked sold at Northside Public.",
              })
            }
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                variant: "error",
                title: "Already sold",
                description: "This copy was sold in another session.",
              })
            }
          >
            Error
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                variant: "warning",
                title: "Low stock",
                description: "River of Ink is below the reorder threshold.",
              })
            }
          >
            Warning
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                variant: "info",
                title: "Sync queued",
                description: "3 offline sales will upload when connected.",
              })
            }
          >
            Info
          </Button>
        </div>
      </Section>

      <Section title="Empty, error & skeleton">
        <div className="grid gap-4 lg:grid-cols-2">
          <EmptyState
            title="No distributions yet"
            description="Allocate stock to a library to start the receiving workflow."
            action={<Button size="sm">Create distribution</Button>}
          />
          <ErrorState
            title="Could not load inventory"
            message="The server rejected this request. Retry after checking your connection."
            action={<Button variant="outline" size="sm">Retry</Button>}
          />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 pt-2">
              <Skeleton variant="circular" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
          <SkeletonTable rows={4} cols={3} />
        </div>
      </Section>
    </div>
  );
}
