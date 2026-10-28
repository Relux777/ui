// Заготовка: план страницы — в docs/_stubs.ts

import { DocStub, stubMetadata } from "@/app/_docs/stub";

export const metadata = stubMetadata("/docs/stacks/nextjs");

export default function Page() {
  return <DocStub href="/docs/stacks/nextjs" />;
}
