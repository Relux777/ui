// Заготовка: план страницы — в docs/_stubs.ts

import { DocStub, stubMetadata } from "@/app/_docs/stub";

export const metadata = stubMetadata("/docs/code/classes");

export default function Page() {
  return <DocStub href="/docs/code/classes" />;
}
