"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  GaugeDoodle,
  CoinsDoodle,
  UmbrellaDoodle,
  RainCloudDoodle,
  LightningDoodle,
  SkullDoodle,
  CheckDoodle,
  CrossDoodle,
  ArrowRightDoodle,
  SparkDoodle,
  SunDoodle,
  StormDoodle,
  WalletDoodle,
  ClockDoodle,
  LadderDoodle,
  WrenchDoodle,
  DoodleCircle,
} from "@/components/brand/icons"

const buttonVariants = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const
const buttonSizes = ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"] as const
const badgeVariants = ["default", "secondary", "destructive", "outline", "ghost", "link"] as const

const doodleIcons = [
  { name: "Gauge", Icon: GaugeDoodle },
  { name: "Coins", Icon: CoinsDoodle },
  { name: "Umbrella", Icon: UmbrellaDoodle },
  { name: "RainCloud", Icon: RainCloudDoodle },
  { name: "Lightning", Icon: LightningDoodle },
  { name: "Skull", Icon: SkullDoodle },
  { name: "Check", Icon: CheckDoodle },
  { name: "Cross", Icon: CrossDoodle },
  { name: "ArrowRight", Icon: ArrowRightDoodle },
  { name: "Spark", Icon: SparkDoodle },
  { name: "Sun", Icon: SunDoodle },
  { name: "Storm", Icon: StormDoodle },
  { name: "Wallet", Icon: WalletDoodle },
  { name: "Clock", Icon: ClockDoodle },
  { name: "Ladder", Icon: LadderDoodle },
  { name: "Wrench", Icon: WrenchDoodle },
]

const fleetRows = [
  { id: "gpt-4o", cost: "$128.40", calls: "18,204", status: "Covered" },
  { id: "claude-sonnet-5", cost: "$96.12", calls: "12,880", status: "Covered" },
  { id: "gemini-2.5-pro", cost: "$54.03", calls: "7,410", status: "At risk" },
  { id: "llama-3.1-70b", cost: "$21.77", calls: "5,092", status: "Covered" },
  { id: "mistral-large", cost: "$8.95", calls: "1,204", status: "Lapsed" },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-2xl text-foreground">{children}</h2>
}

export default function GalleryPage() {
  return (
    <TooltipProvider>
      <div className="flex w-full flex-col gap-8 py-10">
        <section className="flex flex-col gap-3">
          <SectionLabel>Buttons</SectionLabel>
          <p className="text-sm text-muted-foreground">
            (hover state not shown — verify manually)
          </p>
          <div className="flex flex-col gap-4">
            {buttonVariants.map((variant) => (
              <div key={variant} className="flex flex-wrap items-center gap-3">
                <span className="w-24 shrink-0 text-xs font-semibold text-muted-foreground">
                  {variant}
                </span>
                {buttonSizes.map((size) => (
                  <Button key={size} variant={variant} size={size}>
                    {size.startsWith("icon") ? (
                      <SparkDoodle className="size-4" />
                    ) : (
                      "Label"
                    )}
                  </Button>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-muted-foreground">
              disabled
            </span>
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant} disabled>
                Label
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-muted-foreground">
              icon + label
            </span>
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant}>
                <UmbrellaDoodle className="size-4" />
                Coverage
              </Button>
            ))}
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-3">
          <SectionLabel>Inputs</SectionLabel>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gallery-input-default">Default</Label>
              <Input id="gallery-input-default" placeholder="model-endpoint-url" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gallery-input-disabled">Disabled</Label>
              <Input id="gallery-input-disabled" placeholder="unavailable" disabled />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gallery-input-invalid">Invalid</Label>
              <Input
                id="gallery-input-invalid"
                aria-invalid="true"
                defaultValue="not-a-valid-endpoint"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gallery-input-filled">Filled</Label>
              <Input id="gallery-input-filled" defaultValue="gpt-4o-mini" />
            </div>
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-3">
          <SectionLabel>Select</SectionLabel>
          <p className="text-sm text-muted-foreground">
            Dropdown/open state must be checked interactively — not captured here.
          </p>
          <Select defaultValue="gpt-4o">
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Choose a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">gpt-4o</SelectItem>
              <SelectItem value="claude-sonnet-5">claude-sonnet-5</SelectItem>
              <SelectItem value="gemini-2.5-pro">gemini-2.5-pro</SelectItem>
              <SelectItem value="llama-3.1-70b">llama-3.1-70b</SelectItem>
            </SelectContent>
          </Select>
        </section>

        <Separator />

        <section className="flex flex-col gap-3">
          <SectionLabel>Badges</SectionLabel>
          <div className="flex flex-wrap items-center gap-3">
            {badgeVariants.map((variant) => (
              <Badge key={variant} variant={variant}>
                {variant}
              </Badge>
            ))}
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-3">
          <SectionLabel>Cards</SectionLabel>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Default coverage</CardTitle>
                <CardDescription>Standard doodle-frame card with full slots.</CardDescription>
                <CardAction>
                  <Badge variant="secondary">Active</Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">
                  Includes header, content, and footer for baseline verification.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Manage</Button>
              </CardFooter>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>Compact card</CardTitle>
                <CardDescription>size=&quot;sm&quot; variant.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">Tighter spacing throughout.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nested plain card</CardTitle>
                <CardDescription>Outer doodle-frame, inner plain card.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Card plain size="sm">
                  <CardContent>
                    <p className="text-sm text-foreground/80">
                      Nested Card with plain, avoiding a double doodle-frame.
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <p className="text-sm text-foreground/80">
                  Bare card with only CardContent, no header or footer.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-3">
          <SectionLabel>Tabs</SectionLabel>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground">variant=&quot;default&quot;</span>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                  <TabsTrigger value="policy">Policy</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">Overview panel content.</TabsContent>
                <TabsContent value="usage">Usage panel content.</TabsContent>
                <TabsContent value="policy">Policy panel content.</TabsContent>
              </Tabs>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground">variant=&quot;line&quot;</span>
              <Tabs defaultValue="overview">
                <TabsList variant="line">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                  <TabsTrigger value="policy">Policy</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">Overview panel content.</TabsContent>
                <TabsContent value="usage">Usage panel content.</TabsContent>
                <TabsContent value="policy">Policy panel content.</TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-3">
          <SectionLabel>Switch</SectionLabel>
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <Switch id="gallery-switch-on" defaultChecked />
              <Label htmlFor="gallery-switch-on">On (default)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="gallery-switch-off" />
              <Label htmlFor="gallery-switch-off">Off (default)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="gallery-switch-disabled" disabled />
              <Label htmlFor="gallery-switch-disabled">Disabled</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="gallery-switch-on-sm" size="sm" defaultChecked />
              <Label htmlFor="gallery-switch-on-sm">On (sm)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="gallery-switch-off-sm" size="sm" />
              <Label htmlFor="gallery-switch-off-sm">Off (sm)</Label>
            </div>
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-3">
          <SectionLabel>Dialog</SectionLabel>
          <Dialog>
            <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adjust policy limits</DialogTitle>
                <DialogDescription>
                  Changes apply to new sessions immediately.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <Separator />

        <section className="flex flex-col gap-3">
          <SectionLabel>Tooltip</SectionLabel>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
            <TooltipContent>Coverage refreshes every 5 minutes.</TooltipContent>
          </Tooltip>
        </section>

        <Separator />

        <section className="flex flex-col gap-3">
          <SectionLabel>Table</SectionLabel>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Calls</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fleetRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono">{row.id}</TableCell>
                  <TableCell className="font-mono">{row.cost}</TableCell>
                  <TableCell className="font-mono">{row.calls}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.status === "Covered"
                          ? "default"
                          : row.status === "At risk"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <Separator />

        <section className="flex flex-col gap-3">
          <SectionLabel>Skeleton</SectionLabel>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-32 w-full max-w-sm" />
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-3">
          <SectionLabel>Separator</SectionLabel>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground">horizontal</span>
            <Separator />
          </div>
          <div className="flex h-16 items-center gap-4">
            <span className="text-xs font-semibold text-muted-foreground">vertical</span>
            <Separator orientation="vertical" />
            <span className="text-sm text-foreground/80">Content beside a vertical rule.</span>
          </div>
        </section>

        <Separator />

        <section className="flex flex-col gap-4">
          <SectionLabel>Doodle icons</SectionLabel>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground">24px, ink</span>
            <div className="flex flex-wrap gap-4 text-foreground">
              {doodleIcons.map(({ name, Icon }) => (
                <Icon key={name} className="size-6" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground">40px, ink</span>
            <div className="flex flex-wrap gap-4 text-foreground">
              {doodleIcons.map(({ name, Icon }) => (
                <Icon key={name} className="size-10" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground">24px, coral</span>
            <div className="flex flex-wrap gap-4 text-primary">
              {doodleIcons.map(({ name, Icon }) => (
                <Icon key={name} className="size-6" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground">40px, coral</span>
            <div className="flex flex-wrap gap-4 text-primary">
              {doodleIcons.map(({ name, Icon }) => (
                <Icon key={name} className="size-10" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground">DoodleCircle wrapped</span>
            <div className="flex flex-wrap items-center gap-4 text-foreground">
              <DoodleCircle className="size-10">
                <UmbrellaDoodle className="size-full" />
              </DoodleCircle>
              <DoodleCircle className="size-10 text-primary">
                <SparkDoodle className="size-full" />
              </DoodleCircle>
              <DoodleCircle className="size-10 text-primary">
                <CheckDoodle className="size-full" />
              </DoodleCircle>
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  )
}
