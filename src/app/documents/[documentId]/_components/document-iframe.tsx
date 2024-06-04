import { ResizablePanelGroup, ResizablePanel } from '@/components/ui/resizable'

export function DocumentIframe({ url }: { url: string | null }) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full aspect-[16/9]"
    >
      <ResizablePanel defaultSize={100}>
        {url && <iframe src={url} className="w-full h-full" />}
      </ResizablePanel>
      <ResizablePanel defaultSize={0} />
    </ResizablePanelGroup>
  )
}
