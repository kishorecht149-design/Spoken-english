import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiUser } from "@/lib/services/api";
import { createCertificatePdf } from "@/lib/services/certificate";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  const { certificateId } = await params;
  const certificate = await prisma.certificate.findFirst({
    where: { id: certificateId, userId: auth.session.id },
    include: { user: true }
  });

  if (!certificate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const pdfBytes = await createCertificatePdf({
    learnerName: certificate.user.name,
    courseTitle: certificate.title
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${certificate.title}.pdf"`
    }
  });
}
