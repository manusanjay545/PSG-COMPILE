"use client";

import * as React from "react";
import Link from "next/link";
import { Award, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingIndicator } from "@/components/ui/loading-state";

type Certificate = { course_slug: string; course_title: string; certificate_code: string; learner_name: string; issued_at: string; college_name: string | null };

export function ProfileCertificates() {
  const [certificates, setCertificates] = React.useState<Certificate[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    let active = true;
    fetch("/api/course-progress")
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => { if (active && data) setCertificates(data.certificates ?? []); })
      .catch(() => undefined)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <Card className="border-zinc-800 bg-zinc-900/60 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between gap-3"><CardTitle className="flex items-center gap-2 text-lg text-white"><Award className="h-5 w-5 text-amber-300" />Course certificates</CardTitle><Badge variant="outline" className="border-white/10 text-zinc-400">{certificates.length} earned</Badge></CardHeader>
      <CardContent>
        {loading ? <LoadingIndicator label="Loading your certificates…" /> : certificates.length === 0 ? <p className="text-sm text-zinc-400">Finish every chapter in a course to earn your first certificate.</p> : <div className="grid gap-3 sm:grid-cols-2">{certificates.map((certificate) => <div key={certificate.certificate_code} className="rounded-xl border border-amber-300/10 bg-amber-400/[0.04] p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-white">{certificate.course_title}</h3><p className="mt-1 text-xs text-zinc-400">Issued {new Date(certificate.issued_at).toLocaleDateString()}</p></div><Award className="h-5 w-5 text-amber-300" /></div><p className="mt-3 text-[10px] text-zinc-500">Certificate ID · {certificate.certificate_code}</p><Link href={`/courses/${certificate.course_slug}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-indigo-200">View and share <ExternalLink className="h-3 w-3" /></Link></div>)}</div>}
      </CardContent>
    </Card>
  );
}
